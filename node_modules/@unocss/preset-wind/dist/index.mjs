import { definePreset } from '@unocss/core';
import { presetWind3 } from '@unocss/preset-wind3';

const presetWind = definePreset((options = {}) => {
  const wind = presetWind3(options);
  return {
    ...wind,
    name: "@unocss/preset-wind"
  };
});

export { presetWind as default, presetWind };
