"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class DiToken {
    static GetOrCreate(value) {
        if (value === Object || value === undefined) {
            value = Symbol('anonymous');
        }
        if (this.map.has(value)) {
            return this.map.get(value);
        }
        else {
            const token = new this(value);
            this.map.set(value, token);
            return token;
        }
    }
    constructor(value) {
        this.value = value;
    }
}
DiToken.map = new Map();
exports.default = DiToken;
