const app = angular.module('contact-app', []);

app.controller('ContactController', function($scope, $http, $timeout) {
    $scope.availableAccounts = [
        { email: 'rakoto@yahoo.fr', password: 'rakotopassword' },
        { email: 'ravao@yahoo.fr', password: 'ravaopassword' },
        { email: 'randria@yahoo.fr', password: 'randriapassword' }
    ];
    $scope.formContact = {};
    $scope.selectedContact;
    $scope.mode;
    $scope.email = '';
    $scope.password = '';
    $scope.messages = [];
    $scope.textMessage = '';

    var socket = null;
    var token = '';
    $scope.user = null;
    $scope.page = 'login';

    var server = 'http://localhost:3000';
    var apiBaseUrl = `${server}/api/v1`;

    $scope.setAccount = ({ email, password }) => {
        $scope.email = email;
        $scope.password = password;
    };

    $scope.login = (email, password) => {
        $http
            .post(`${apiBaseUrl}/authentication/login`, { email, password })
            .then(res => {
                console.log('Authentication success: ', res);
                $scope.user = res.data.user;
                token = res.data.token;
                websocketConnect(token);
            })
            .catch(err => console.log('Authentication failed: ', err));
    };

    function websocketConnect() {
        socket = io({ query: `userId=${$scope.user._id}&token=${token}` }); // Connexion websocket au server

        socket.on('connect', () => {
            $timeout(() => {
                enterChatPage();
            });
        });

        socket.on('disconnect', () => console.log('Client deconnecté'));

        socket.on('message', (message, ack) => {
            console.log('Message reçu: ', message);
            $timeout(() => {
                $scope.messages.push(message);
            });
            ack();
        });

        socket.on('messages', (messages, ack) => {
            console.log('Messages reçus: ', messages);
            $timeout(() => {
                $scope.messages.push(...messages);
            });
            ack();
        });

        socket.on('notification', data => console.log('Notification réçue: ', data));
    }

    function enterChatPage() {
        $scope.page = 'chat';
        $http
            .get(`${apiBaseUrl}/user`, { headers: { Authorization: `bearer ${token}` } })
            .then(res => {
                console.log('Users fetched: ', res.data);
                $scope.contacts = res.data.filter(u => u._id !== $scope.user._id);
            })
            .catch(err => console.log('Error on loading users: ', err));
    }

    $scope.onSelectContact = contact => {
        $scope.selectedContact = contact;
        $scope.messages = [];
    };

    $scope.sendMessage = () => {
        console.log('Body: ', $scope.textMessage);
        const newMessage = {
            body: $scope.textMessage,
            from: $scope.user._id,
            to: $scope.selectedContact._id
        };
        $scope.messages.push(newMessage);
        socket.emit('message', newMessage);
        $scope.textMessage = '';
    };
});
