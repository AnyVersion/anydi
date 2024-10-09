import DiInjection from "../injection";
import DiToken from "../token";
export default class DiContainer {
    static id: number;
    private dataMap;
    private dataSet;
    private resolvers;
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
    getData(token: DiToken): any;
    private resolve;
    factory(injection: DiInjection): any;
    track<T>(fn: () => T): T;
    setData<T>(token: DiToken, data: T): void;
    addData<T>(data: T): T;
    private isDestroyed;
    destroy(): void;
}
