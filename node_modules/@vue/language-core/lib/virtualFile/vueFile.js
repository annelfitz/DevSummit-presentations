"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VueVirtualCode = void 0;
const alien_signals_1 = require("alien-signals");
const plugins_1 = require("../plugins");
const computedEmbeddedCodes_1 = require("./computedEmbeddedCodes");
const computedSfc_1 = require("./computedSfc");
const computedVueSfc_1 = require("./computedVueSfc");
class VueVirtualCode {
    get snapshot() {
        return this._snapshot();
    }
    get vueSfc() {
        return this._vueSfc();
    }
    get embeddedCodes() {
        return this._embeddedCodes();
    }
    get mappings() {
        return this._mappings();
    }
    constructor(fileName, languageId, initSnapshot, vueCompilerOptions, plugins, ts) {
        this.fileName = fileName;
        this.languageId = languageId;
        this.initSnapshot = initSnapshot;
        this.vueCompilerOptions = vueCompilerOptions;
        this.plugins = plugins;
        this.ts = ts;
        this.id = 'main';
        this._snapshot = (0, alien_signals_1.signal)(initSnapshot);
        this._vueSfc = (0, computedVueSfc_1.computedVueSfc)(this.plugins, this.fileName, this.languageId, this._snapshot);
        this.sfc = (0, computedSfc_1.computedSfc)(this.ts, this.plugins, this.fileName, this._snapshot, this._vueSfc);
        this._embeddedCodes = (0, computedEmbeddedCodes_1.computedEmbeddedCodes)(this.plugins, this.fileName, this.sfc);
        this._mappings = (0, alien_signals_1.computed)(() => {
            const snapshot = this._snapshot();
            return [{
                    sourceOffsets: [0],
                    generatedOffsets: [0],
                    lengths: [snapshot.getLength()],
                    data: plugins_1.allCodeFeatures,
                }];
        });
    }
    update(newSnapshot) {
        this._snapshot(newSnapshot);
    }
}
exports.VueVirtualCode = VueVirtualCode;
//# sourceMappingURL=vueFile.js.map