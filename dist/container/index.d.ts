import DiInjection from "../injection";
import DiToken from "../token";
import { Constructor } from "../utils";
export default class DiContainer {
    static Get(instance: any): DiContainer;
    static id: number;
    private dataMap;
    private dataSet;
    private resolvers;
    private creating;
    private children;
    private parent?;
    id: number;
    constructor({ providers }?: {
        providers?: {
            token: any;
            resolver: () => any;
        }[];
    });
    setParent(parent: this): void;
    getData(arg: DiToken | unknown): any;
    private resolve;
    factory<T>(arg: DiInjection | T): T extends Constructor ? InstanceType<T> : any;
    track<T>(fn: () => T): T;
    setData<T>(arg: DiToken | unknown, data: T): void;
    notify<T>(token: DiToken, data: T): void;
    addData<T>(data: T): T;
    private isDestroyed;
    destroy(): void;
}
