type Data = any;
export default class DiInfo {
    private ins;
    static data: WeakMap<any, DiInfo>;
    static Get(ins: Data): DiInfo | undefined;
    static GetOrCreate(ins: Data): DiInfo;
    static Delete(ins: Data): void;
    private container;
    private injections;
    private destroyCallbacks;
    constructor(ins: Data);
    private isInitialized;
    init(): void;
    track<T>(fn: () => T): T;
    getData(key: string): any;
    private isDestroyed;
    destroy(): void;
}
export {};
