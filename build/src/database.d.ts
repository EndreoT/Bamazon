interface Config {
    host: string;
    port: number;
    user: string;
    password: string;
    database: string;
}
export declare class Database {
    connection: any;
    constructor(config: Config);
    close(): Promise<void>;
}
export {};
