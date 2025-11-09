import type { CodeInformation, Mapping, VirtualCode } from '@volar/language-core';
import type * as ts from 'typescript';
import type { VueCompilerOptions, VueLanguagePluginReturn } from '../types';
import { computedSfc } from './computedSfc';
export declare class VueVirtualCode implements VirtualCode {
    fileName: string;
    languageId: string;
    initSnapshot: ts.IScriptSnapshot;
    vueCompilerOptions: VueCompilerOptions;
    plugins: VueLanguagePluginReturn[];
    ts: typeof import('typescript');
    readonly id = "main";
    readonly sfc: ReturnType<typeof computedSfc>;
    private _snapshot;
    private _vueSfc;
    private _embeddedCodes;
    private _mappings;
    get snapshot(): ts.IScriptSnapshot;
    get vueSfc(): import("@vue/compiler-sfc").SFCParseResult | undefined;
    get embeddedCodes(): VirtualCode[];
    get mappings(): Mapping<CodeInformation>[];
    constructor(fileName: string, languageId: string, initSnapshot: ts.IScriptSnapshot, vueCompilerOptions: VueCompilerOptions, plugins: VueLanguagePluginReturn[], ts: typeof import('typescript'));
    update(newSnapshot: ts.IScriptSnapshot): void;
}
