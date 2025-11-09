import { randomFillSync } from 'node:crypto';
import _fs from 'node:fs';
import { performance } from 'node:perf_hooks';
if (!globalThis.fs) {
    globalThis.fs = _fs;
}
if (!globalThis.crypto) {
    globalThis.crypto = {
        getRandomValues: randomFillSync,
    };
}
if (!globalThis.performance) {
    globalThis.performance = performance;
}
//# sourceMappingURL=shim.js.map