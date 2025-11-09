import * as webpack from 'webpack';
import { Options } from './types.js';
import '@antfu/utils';
import 'unplugin';
import 'unplugin-utils';

declare const _default: (options: Options) => webpack.WebpackPluginInstance;

export { _default as default };
