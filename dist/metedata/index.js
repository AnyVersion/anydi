"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const info_1 = __importDefault(require("../info"));
const symbol = {
    container: Symbol('container'),
    injection: Symbol('injection'),
    service: Symbol('service'),
    destroy: Symbol('destroy')
};
class DiMetadata {
    static defineContainerOptions(prototype, options) {
        Reflect.defineMetadata(symbol.container, options, prototype);
    }
    static getContainerOptions(prototype) {
        const properties = Array.isArray(prototype) ? prototype : [prototype];
        for (const property of properties) {
            const options = Reflect.getOwnMetadata(symbol.container, property);
            if (options) {
                return options;
            }
        }
    }
    static defineService(prototype) {
        Reflect.defineMetadata(symbol.service, true, prototype);
    }
    static isService(prototype) {
        const properties = Array.isArray(prototype) ? prototype : [prototype];
        return properties.some(property => Reflect.getOwnMetadata(symbol.service, property) === true);
    }
    static defineInjection(prototype, key, injection) {
        const injections = Reflect.getOwnMetadata(symbol.injection, prototype) || [];
        injections.push({ key, injection });
        Reflect.defineMetadata(symbol.injection, injections, prototype);
        Object.defineProperty(prototype, key, {
            enumerable: true,
            configurable: true,
            get() {
                return this[key] = info_1.default.GetOrCreate(this).getData(key);
            },
            set(value) {
                Object.defineProperty(this, key, {
                    value,
                    writable: true,
                    configurable: true,
                    enumerable: true
                });
            },
        });
    }
    static getInjections(prototype) {
        const properties = Array.isArray(prototype) ? prototype : [prototype];
        const injections = [];
        for (const property of properties) {
            const propertyInjections = Reflect.getOwnMetadata(symbol.injection, property) || [];
            injections.push(...propertyInjections);
        }
        return injections;
    }
    static defineDestroyCallback(prototype, callback) {
        const callbacks = Reflect.getOwnMetadata(symbol.destroy, prototype) || [];
        callbacks.push(callback);
        Reflect.defineMetadata(symbol.destroy, callbacks, prototype);
    }
    static getDestroyCallbacks(prototype) {
        const properties = Array.isArray(prototype) ? prototype : [prototype];
        const callbacks = [];
        for (const property of properties) {
            const propertyCallbacks = Reflect.getOwnMetadata(symbol.destroy, property) || [];
            callbacks.push(...propertyCallbacks);
        }
        return callbacks;
    }
}
exports.default = DiMetadata;
