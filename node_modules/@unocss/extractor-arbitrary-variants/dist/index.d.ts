import { Extractor } from '@unocss/core';

declare const quotedArbitraryValuesRE: RegExp;
declare const arbitraryPropertyRE: RegExp;
declare function splitCodeWithArbitraryVariants(code: string): string[];
declare function extractorArbitraryVariants(): Extractor;

export { arbitraryPropertyRE, extractorArbitraryVariants, quotedArbitraryValuesRE, splitCodeWithArbitraryVariants };
