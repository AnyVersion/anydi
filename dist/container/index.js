"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const info_1 = __importDefault(require("../info"));
const token_1 = __importDefault(require("../token"));
const track_1 = __importDefault(require("../track"));
class DiContainer {
    constructor({ providers } = {}) {
        this.dataMap = new WeakMap();
        this.dataSet = new Set();
        this.resolvers = new WeakMap();
        this.children = new Set();
        this.id = DiContainer.id++;
        this.isDestroyed = false;
        providers === null || providers === void 0 ? void 0 : providers.forEach(item => {
            this.resolvers.set(token_1.default.GetOrCreate(item.token), item.resolver);
        });
    }
    setParent(parent) {
        parent.children.add(this);
        this.parent = parent;
    }
    getData(token) {
        var _a;
        if (this.dataMap.has(token)) {
            return this.dataMap.get(token);
        }
        else {
            return (_a = this.parent) === null || _a === void 0 ? void 0 : _a.getData(token);
        }
    }
    resolve(token) {
        var _a;
        if (this.resolvers.has(token)) {
            return this.resolvers.get(token)();
        }
        return (_a = this.parent) === null || _a === void 0 ? void 0 : _a.resolve(token);
    }
    factory(injection) {
        const token = injection.getToken();
        const data = this.getData(token);
        if (data !== undefined) {
            return data;
        }
        const value = this.resolve(token) || injection.factory();
        this.setData(token, value);
        return value;
    }
    track(fn) {
        try {
            track_1.default.push(this);
            return fn();
        }
        finally {
            track_1.default.pop();
        }
    }
    setData(token, data) {
        if (!this.dataMap.has(token)) {
            this.dataMap.set(token, data);
            this.addData(data);
        }
        else {
            if (this.dataMap.get(token) !== data) {
                throw new Error('Different values ​​in the container');
            }
        }
    }
    addData(data) {
        this.dataSet.add(data);
        return data;
    }
    destroy() {
        if (this.isDestroyed)
            return;
        this.isDestroyed = true;
        this.children.forEach(container => {
            container.destroy();
        });
        this.dataSet.forEach(data => {
            var _a;
            (_a = info_1.default.Get(data)) === null || _a === void 0 ? void 0 : _a.destroy();
        });
        this.dataSet.clear();
        this.dataSet = null;
        this.dataMap = null;
        this.parent = null;
        this.resolvers = null;
        this.children.clear();
    }
}
DiContainer.id = 0;
exports.default = DiContainer;
