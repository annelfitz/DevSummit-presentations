(function (exports, vue, shared) {
  'use strict';

  function createGenericProjection(fromDomain, toDomain, projector) {
    return (input) => {
      return vue.computed(() => projector(vue.toValue(input), vue.toValue(fromDomain), vue.toValue(toDomain)));
    };
  }

  function defaultNumericProjector(input, from, to) {
    return (input - from[0]) / (from[1] - from[0]) * (to[1] - to[0]) + to[0];
  }
  function createProjection(fromDomain, toDomain, projector = defaultNumericProjector) {
    return createGenericProjection(fromDomain, toDomain, projector);
  }

  function logicAnd(...args) {
    return vue.computed(() => args.every((i) => vue.toValue(i)));
  }

  function logicNot(v) {
    return vue.computed(() => !vue.toValue(v));
  }

  function logicOr(...args) {
    return vue.computed(() => args.some((i) => vue.toValue(i)));
  }

  function useAbs(value) {
    return vue.computed(() => Math.abs(vue.toValue(value)));
  }

  function toValueArgsFlat(args) {
    return args.flatMap((i) => {
      const v = vue.toValue(i);
      if (Array.isArray(v))
        return v.map((i2) => vue.toValue(i2));
      return [v];
    });
  }

  function useAverage(...args) {
    return vue.computed(() => {
      const array = toValueArgsFlat(args);
      return array.reduce((sum, v) => sum += v, 0) / array.length;
    });
  }

  function useCeil(value) {
    return vue.computed(() => Math.ceil(vue.toValue(value)));
  }

  function useClamp(value, min, max) {
    if (typeof value === "function" || vue.isReadonly(value))
      return vue.computed(() => shared.clamp(vue.toValue(value), vue.toValue(min), vue.toValue(max)));
    const _value = vue.ref(value);
    return vue.computed({
      get() {
        return _value.value = shared.clamp(_value.value, vue.toValue(min), vue.toValue(max));
      },
      set(value2) {
        _value.value = shared.clamp(value2, vue.toValue(min), vue.toValue(max));
      }
    });
  }

  function useFloor(value) {
    return vue.computed(() => Math.floor(vue.toValue(value)));
  }

  function useMath(key, ...args) {
    return shared.reactify(Math[key])(...args);
  }

  function useMax(...args) {
    return vue.computed(() => {
      const array = toValueArgsFlat(args);
      return Math.max(...array);
    });
  }

  function useMin(...args) {
    return vue.computed(() => {
      const array = toValueArgsFlat(args);
      return Math.min(...array);
    });
  }

  function accurateMultiply(value, power) {
    const valueStr = value.toString();
    if (value > 0 && valueStr.includes(".")) {
      const decimalPlaces = valueStr.split(".")[1].length;
      const multiplier = 10 ** decimalPlaces;
      return value * multiplier * power / multiplier;
    } else {
      return value * power;
    }
  }
  function usePrecision(value, digits, options) {
    return vue.computed(() => {
      var _a;
      const _value = vue.toValue(value);
      const _digits = vue.toValue(digits);
      const power = 10 ** _digits;
      return Math[((_a = vue.toValue(options)) == null ? void 0 : _a.math) || "round"](accurateMultiply(_value, power)) / power;
    });
  }

  function useProjection(input, fromDomain, toDomain, projector) {
    return createProjection(fromDomain, toDomain, projector)(input);
  }

  function useRound(value) {
    return vue.computed(() => Math.round(vue.toValue(value)));
  }

  function useSum(...args) {
    return vue.computed(() => toValueArgsFlat(args).reduce((sum, v) => sum += v, 0));
  }

  function useTrunc(value) {
    return vue.computed(() => Math.trunc(vue.toValue(value)));
  }

  exports.and = logicAnd;
  exports.createGenericProjection = createGenericProjection;
  exports.createProjection = createProjection;
  exports.logicAnd = logicAnd;
  exports.logicNot = logicNot;
  exports.logicOr = logicOr;
  exports.not = logicNot;
  exports.or = logicOr;
  exports.useAbs = useAbs;
  exports.useAverage = useAverage;
  exports.useCeil = useCeil;
  exports.useClamp = useClamp;
  exports.useFloor = useFloor;
  exports.useMath = useMath;
  exports.useMax = useMax;
  exports.useMin = useMin;
  exports.usePrecision = usePrecision;
  exports.useProjection = useProjection;
  exports.useRound = useRound;
  exports.useSum = useSum;
  exports.useTrunc = useTrunc;

})(this.VueUse = this.VueUse || {}, Vue, VueUse);
