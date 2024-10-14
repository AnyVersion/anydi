"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class DiTrack {
    static push(container) {
        this.data.push(container);
    }
    static pop() {
        return this.data.pop();
    }
    static take() {
        return this.data[this.data.length - 1];
    }
}
DiTrack.data = [];
exports.default = DiTrack;
