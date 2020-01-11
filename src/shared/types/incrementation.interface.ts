export enum IncrementationMode {
    INCREMENT = 'INCREMENT',
    DECREMENT = 'DECREMENT'
}

export interface Incrementation {
    value: number;
    mode: IncrementationMode;
}
