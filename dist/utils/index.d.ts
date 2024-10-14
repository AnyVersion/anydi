export declare function getPrototypeChain(prototype: Object): Object[];
export type Constructor = new (...args: any[]) => any;
export type AbstractConstructor<T = any> = abstract new (...args: any[]) => T;
export type AllConstructors = Constructor | AbstractConstructor;
export declare function isConstructor(value: unknown): value is Constructor;
