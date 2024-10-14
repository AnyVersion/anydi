import 'reflect-metadata';
import DiContainer from "../container";
import DiInjection from '../injection';
type ContainerOptions = ConstructorParameters<typeof DiContainer>;
export default class DiMetadata {
    static defineContainerOptions(prototype: Object, options: ContainerOptions): void;
    static getContainerOptions(prototype: Object | Object[]): [({
        providers?: {
            token: any;
            resolver: () => any;
        }[];
    } | undefined)?] | undefined;
    static defineRoot(prototype: Object, options: ContainerOptions): void;
    static getRoot(prototype: Object | Object[]): [({
        providers?: {
            token: any;
            resolver: () => any;
        }[];
    } | undefined)?] | undefined;
    static defineService(prototype: Object): void;
    static isService(prototype: Object | Object[]): boolean;
    static defineInjection(prototype: Object, key: string, injection: DiInjection): void;
    static getInjections(prototype: Object | Object[]): {
        key: string;
        injection: DiInjection;
    }[];
    static defineDestroyCallback(prototype: Object, callback: Function): void;
    static getDestroyCallbacks(prototype: Object | Object[]): Function[];
}
export {};
