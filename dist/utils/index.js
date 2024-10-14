"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPrototypeChain = getPrototypeChain;
exports.isConstructor = isConstructor;
function getPrototypeChain(prototype) {
    const chain = [];
    let proto = prototype;
    while (proto) {
        if (proto === Object.prototype) {
            break;
        }
        chain.push(proto);
        proto = Object.getPrototypeOf(proto);
    }
    return chain;
}
function isConstructor(value) {
    return typeof value === 'function' && value !== Object;
}
