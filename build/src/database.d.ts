import * as mysqlTypes from "../node_modules/@types/mysql";
export declare class Database {
    connection: mysqlTypes.Connection;
    constructor(config: mysqlTypes.ConnectionConfig);
    getAllProducts(): Promise<mysqlTypes.QueryFunction[]>;
    close(): Promise<void>;
}
