"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const container_1 = __importDefault(require("../container"));
const metedata_1 = __importDefault(require("../metedata"));
const track_1 = __importDefault(require("../track"));
const utils_1 = require("../utils");
const config_1 = __importDefault(require("../config"));
class DiInfo {
    static Get(ins) {
        return this.data.get(ins);
    }
    static GetOrCreate(ins) {
        if (this.data.has(ins)) {
            return this.data.get(ins);
        }
        else {
            const info = new this(ins);
            this.data.set(ins, info);
            return info;
        }
    }
    static Create(ins, prototypes) {
        if (this.data.has(ins)) {
            throw new Error('Instance already created');
        }
        const info = new this(ins, prototypes);
        this.data.set(ins, info);
        return info;
    }
    static Delete(ins) {
        this.data.delete(ins);
    }
    static GetContainer(ins) {
        return this.GetOrCreate(ins).container;
    }
    constructor(ins, prototypes = (0, utils_1.getPrototypeChain)(ins)) {
        this.ins = ins;
        this.injections = new Map();
        this.isInitialized = false;
        this.isDestroyed = false;
        const isService = metedata_1.default.isService(prototypes);
        if (!isService) {
            throw new Error(`'${ins.constructor.name}' must be decorated with @Service()`);
        }
        let container = track_1.default.take();
        if (!container) {
            const root = metedata_1.default.getRoot(prototypes);
            if (root) {
                container = new container_1.default(...root);
            }
            else {
                throw new Error(`'${ins.constructor.name}' must be created with container`);
            }
        }
        const containerOptions = metedata_1.default.getContainerOptions(prototypes);
        if (containerOptions) {
            this.container = new container_1.default(...containerOptions);
            this.container.setParent(container);
        }
        else {
            this.container = container;
        }
        this.destroyCallbacks = metedata_1.default.getDestroyCallbacks(prototypes);
        metedata_1.default.getInjections(prototypes).forEach(({ key, injection }) => {
            if (!this.injections.has(key)) {
                this.injections.set(key, injection);
            }
        });
    }
    init() {
        if (this.isInitialized)
            return;
        this.isInitialized = true;
        this.injections.forEach((injection, key) => {
            const descriptor = Object.getOwnPropertyDescriptor(this.ins, key);
            if (!descriptor || (!descriptor.get && !descriptor.set && descriptor.value === undefined)) {
                if (injection.optional) {
                    Object.defineProperty(this.ins, key, {
                        get: () => this.getData(key),
                        enumerable: true,
                        configurable: true
                    });
                }
                else if (injection.lazy || config_1.default.defaultLazy) {
                    Object.defineProperty(this.ins, key, {
                        get: () => this.getData(key),
                        set: (value) => {
                            Object.defineProperty(this.ins, key, {
                                value,
                                enumerable: true,
                                configurable: true
                            });
                        },
                        enumerable: true,
                        configurable: true
                    });
                }
                else {
                    this.ins[key] = this.getData(key);
                }
            }
        });
    }
    track(fn) {
        return this.container.track(fn);
    }
    getData(key) {
        const injection = this.injections.get(key);
        if (!injection) {
            throw new Error('Injection not found');
        }
        const token = injection.getToken();
        if (injection.optional) {
            return this.container.getData(token);
        }
        return this.container.factory(injection);
    }
    destroy() {
        if (this.isDestroyed)
            return;
        this.isDestroyed = true;
        this.destroyCallbacks.forEach(callback => callback.call(this.ins));
        DiInfo.Delete(this.ins);
        this.ins = null;
        this.injections.clear();
        this.container.destroy();
        this.container = null;
    }
}
DiInfo.data = new WeakMap();
exports.default = DiInfo;
