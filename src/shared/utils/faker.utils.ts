import * as faker from 'faker';
import * as fs from 'fs';

export const takeOneRandomlyFrom = <T>(items: T[]): T =>
    items[Math.floor(Math.random() * items.length)];

export const sliceRandomlyFrom = <T>(items: T[]): T[] => {
    let start: number, end: number;
    do {
        start = Math.floor(Math.random() * items.length);
        end = Math.floor(Math.random() * items.length);
    } while (end < start);
    return items.slice(start, end + 1);
};

// String of 24 hex characters:
export const mongoDbObjectId = (): string =>
    faker.random
        .uuid()
        .slice(9)
        .replace(/-/g, '');

export const writeToJson = <T>(filename: string, items: T[]) => {
    fs.writeFile(`./seeds/${filename}`, JSON.stringify(items), () => {
        // tslint:disable-next-line:no-console
        console.log(
            `${filename} successfully created, type 'npm run seed' to insert it into database`
        );
    });
};

export const getFromJson = <T>(filename: string): T[] =>
    JSON.parse(fs.readFileSync(`./seeds/${filename}`, 'utf8')) as T[];
