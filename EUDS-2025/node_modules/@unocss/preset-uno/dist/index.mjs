import { definePreset } from '@unocss/core';
import { presetWind3 } from '@unocss/preset-wind3';

const presetUno = definePreset((options = {}) => {
  const wind = presetWind3(options);
  return {
    ...wind,
    name: "@unocss/preset-uno"
  };
});

export { presetUno as default, presetUno };
