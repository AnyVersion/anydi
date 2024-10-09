"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DiMetadata = exports.DiInfo = exports.DiInjection = exports.DiContainer = void 0;
exports.Inject = Inject;
exports.InjectRef = InjectRef;
exports.Optional = Optional;
exports.Lazy = Lazy;
exports.Service = Service;
exports.Container = Container;
exports.Destroy = Destroy;
exports.DiFrom = DiFrom;
exports.DiRoot = DiRoot;
const container_1 = __importDefault(require("./container"));
exports.DiContainer = container_1.default;
const injection_1 = __importDefault(require("./injection"));
exports.DiInjection = injection_1.default;
const info_1 = __importDefault(require("./info"));
exports.DiInfo = info_1.default;
const metedata_1 = __importDefault(require("./metedata"));
exports.DiMetadata = metedata_1.default;
function Inject(token) {
    return function (prototype, key) {
        return metedata_1.default.defineInjection(prototype, key, new injection_1.default({
            token: token || Reflect.getMetadata('design:type', prototype, key)
        }));
    };
}
function InjectRef(ref) {
    return function (prototype, key) {
        return metedata_1.default.defineInjection(prototype, key, new injection_1.default({
            ref
        }));
    };
}
function Optional({ token, ref } = {}) {
    return function (prototype, key) {
        return metedata_1.default.defineInjection(prototype, key, new injection_1.default(ref ? {
            ref,
            optional: true
        } : {
            token: token || Reflect.getMetadata('design:type', prototype, key),
            optional: true
        }));
    };
}
function Lazy({ token, ref } = {}) {
    return function (prototype, key) {
        return metedata_1.default.defineInjection(prototype, key, new injection_1.default(ref ? {
            ref,
            lazy: true
        } : {
            token: token || Reflect.getMetadata('design:type', prototype, key),
            lazy: true
        }));
    };
}
function Service() {
    return function (target) {
        class Service extends target {
            constructor(...args) {
                super(...args);
                info_1.default.GetOrCreate(this).init();
            }
        }
        metedata_1.default.defineService(Service.prototype);
        Object.defineProperty(Service, 'name', { value: target.name + '@Service' });
        return Service;
    };
}
function Container(...args) {
    return function (target) {
        metedata_1.default.defineContainerOptions(target.prototype, args);
        return target;
    };
}
function Destroy(prototype, propertyKey, descriptor) {
    metedata_1.default.defineDestroyCallback(prototype, descriptor.value);
    descriptor.value = function () {
        var _a;
        (_a = info_1.default.Get(this)) === null || _a === void 0 ? void 0 : _a.destroy();
    };
}
function DiFrom(instance) {
    return {
        for: (fn) => info_1.default.GetOrCreate(instance).track(fn)
    };
}
function DiRoot(...args) {
    return {
        for: (fn) => new container_1.default(...args).track(fn)
    };
}
