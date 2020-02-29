export const toLocaleDateString = (d: Date) =>
    `${d
        .getDate()
        .toString()
        .padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}/${d
        .getFullYear()
        .toString()
        .padStart(2, '0')}`;
