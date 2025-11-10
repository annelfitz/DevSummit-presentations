import type { InlayHintInfo } from '../inlayHints';
import type { ScriptCodegenOptions } from './index';
export type ScriptCodegenContext = ReturnType<typeof createScriptCodegenContext>;
export declare function createScriptCodegenContext(options: ScriptCodegenOptions): {
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
    inlayHints: InlayHintInfo[];
};
