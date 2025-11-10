import { j as RecordingEntry } from './shared/unhead.Prz0gZXE.mjs';
export { A as AsVoidFunctions, E as EventHandlerOptions, i as ScriptInstance, h as UseFunctionType, g as UseScriptContext, a as UseScriptInput, b as UseScriptOptions, d as UseScriptResolvedInput, c as UseScriptReturn, f as UseScriptStatus, W as WarmupStrategy } from './shared/unhead.Prz0gZXE.mjs';
export { r as resolveScriptKey, u as useScript } from './shared/unhead.CnYfgE7E.mjs';
import 'hookable';

declare function createSpyProxy<T extends Record<string, any> | any[]>(target: T, onApply: (stack: RecordingEntry[][]) => void): T;

export { RecordingEntry, createSpyProxy };
