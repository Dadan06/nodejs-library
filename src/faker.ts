import { exec } from 'child_process';

const execute = (command: string) =>
    new Promise((resolve, reject) => {
        exec(command, (err, stdout, stderr) => {
            if (err) {
                // tslint:disable-next-line:no-console
                console.error(err);
                reject(err);
            } else {
                // tslint:disable-next-line:no-console
                console.log(stdout);
                resolve(stdout);
            }
        });
    });

const fakeAll = async () => {
    await execute('ts-node ./src/supplier/supplier.faker.ts');
};

fakeAll();
