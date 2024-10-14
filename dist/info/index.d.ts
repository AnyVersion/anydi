import DiContainer from "../container";
type Data = any;
export default class DiInfo {
    private ins;
    static data: WeakMap<any, DiInfo>;
    static Get(ins: Data): DiInfo | undefined;
    static GetOrCreate(ins: Data): DiInfo;
    static Create(ins: Data, prototypes?: Object[]): DiInfo;
    static Delete(ins: Data): void;
    static GetContainer(ins: Data): DiContainer;
    private container;
    private injections;
    private destroyCallbacks;
    constructor(ins: Data, prototypes?: Object[]);
    private isInitialized;
    init(): void;
    track<T>(fn: () => T): T;
    getData(key: string): any;
    private isDestroyed;
    destroy(): void;
}
export {};
