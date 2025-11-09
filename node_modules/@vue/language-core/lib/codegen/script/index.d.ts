import type * as ts from 'typescript';
import type { ScriptRanges } from '../../parsers/scriptRanges';
import type { ScriptSetupRanges } from '../../parsers/scriptSetupRanges';
import type { Code, Sfc, SfcBlock, VueCompilerOptions } from '../../types';
import type { TemplateCodegenContext } from '../template/context';
export interface ScriptCodegenOptions {
    ts: typeof ts;
    compilerOptions: ts.CompilerOptions;
    vueCompilerOptions: VueCompilerOptions;
    sfc: Sfc;
    fileName: string;
    lang: string;
    scriptRanges: ScriptRanges | undefined;
    scriptSetupRanges: ScriptSetupRanges | undefined;
    templateCodegen: TemplateCodegenContext & {
        codes: Code[];
    } | undefined;
    destructuredPropNames: Set<string>;
    templateRefNames: Set<string>;
}
export { generate as generateScript };
declare function generate(options: ScriptCodegenOptions): {
    codes: Code[];
    generatedTemplate: boolean;
    generatedPropsType: boolean;
    bypassDefineComponent: boolean;
    bindingNames: Set<string>;
    localTypes: {
        generate: () => Generator<string, void, unknown>;
        readonly PrettifyLocal: string;
        readonly WithDefaultsLocal: string;
        readonly WithSlots: string;
        readonly PropsChildren: string;
        readonly TypePropsToOption: string;
        readonly OmitIndexSignature: string;
    };
    inlayHints: import("../inlayHints").InlayHintInfo[];
};
export declare function generateConstExport(options: ScriptCodegenOptions, block: SfcBlock): Generator<Code>;
