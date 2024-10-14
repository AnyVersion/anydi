import DiContainer from "./container";
import DiInjection from "./injection";
import DiInfo from "./info";
import DiMetadata from "./metedata";
import { AllConstructors, Constructor } from "./utils";
import Config from './config';
export declare function Inject(token?: any): <T extends Object>(prototype: T, key: string) => void;
export declare function InjectRef(ref: () => any): <T extends Object>(prototype: T, key: string) => void;
export type ToType<T> = T;
export declare function Optional({ token, ref }?: {
    token?: any;
    ref?: () => any;
}): <T extends Object>(prototype: T, key: string) => void;
export declare function Lazy({ token, ref }?: {
    token?: any;
    ref?: () => any;
}): <T extends Object>(prototype: T, key: string) => void;
export declare function Service(): <T extends AllConstructors>(target: T) => {
    new (...args: any[]): {};
} & T;
export declare function Container(...args: ConstructorParameters<typeof DiContainer>): <T extends AllConstructors>(target: T) => T;
export declare function Destroy<T extends Object>(prototype: T, propertyKey: string, descriptor: PropertyDescriptor): void;
export declare function DiFrom(instance: any): {
    for: <T>(fn: () => T) => T;
    add: <T>(fn: () => T, token?: unknown) => T;
    factory: <T extends Constructor>(ctor: T) => InstanceType<T>;
};
export declare function Root(...args: ConstructorParameters<typeof DiContainer>): <T extends AllConstructors>(target: T) => T;
export declare function setConfig(newConfig: Partial<typeof Config>): void;
export { DiContainer, DiInjection, DiInfo, DiMetadata };
