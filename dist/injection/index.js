"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const utils_1 = require("../utils");
const token_1 = __importDefault(require("../token"));
class DiInjection {
    constructor(options) {
        this.options = options;
        this.optional = options.optional === true;
        this.lazy = options.lazy === true;
    }
    getToken() {
        if (!this.token) {
            this.token = token_1.default.GetOrCreate('ref' in this.options ? this.options.ref() : this.options.token);
        }
        return this.token;
    }
    factory() {
        if ('resolver' in this.options && this.options.resolver) {
            return this.options.resolver();
        }
        let Ctor;
        if ('ref' in this.options) {
            Ctor = this.options.ref();
        }
        else {
            if ((0, utils_1.isConstructor)(this.options.token)) {
                Ctor = this.options.token;
            }
        }
        if (Ctor) {
            return new Ctor;
        }
        console.log(this.options);
        throw new Error('Injection does not have Resolver');
    }
}
exports.default = DiInjection;
