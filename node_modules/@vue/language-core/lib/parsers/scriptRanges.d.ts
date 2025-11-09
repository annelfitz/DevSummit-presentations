import type * as ts from 'typescript';
import type { TextRange } from '../types';
export interface ScriptRanges extends ReturnType<typeof parseScriptRanges> {
}
export declare function parseScriptRanges(ts: typeof import('typescript'), ast: ts.SourceFile, hasScriptSetup: boolean): {
    exportDefault: (TextRange & {
        expression: TextRange;
    }) | undefined;
    componentOptions: {
        expression: TextRange;
        args: TextRange;
        argsNode: ts.ObjectLiteralExpression;
        components: TextRange | undefined;
        componentsNode: ts.ObjectLiteralExpression | undefined;
        directives: TextRange | undefined;
        name: TextRange | undefined;
        inheritAttrs: string | undefined;
    } | undefined;
    bindings: {
        range: TextRange;
        moduleName?: string;
        isDefaultImport?: boolean;
        isNamespace?: boolean;
    }[];
};
