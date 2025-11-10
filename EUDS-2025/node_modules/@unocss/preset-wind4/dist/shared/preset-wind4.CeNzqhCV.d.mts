interface Colors {
    [key: string]: Colors & {
        DEFAULT?: string;
    } | string;
}
interface ThemeAnimation {
    keyframes?: Record<string, string>;
    durations?: Record<string, string>;
    timingFns?: Record<string, string>;
    properties?: Record<string, object>;
    counts?: Record<string, string | number>;
    category?: Record<string, string>;
}
interface Theme {
    font?: Record<string, string>;
    colors?: Colors;
    spacing?: Record<string, string>;
    breakpoint?: Record<string, string>;
    verticalBreakpoint?: Record<string, string>;
    container?: Record<string, string>;
    text?: Record<string, {
        fontSize?: string;
        lineHeight?: string;
        letterSpacing?: string;
    }>;
    fontWeight?: Record<string, string>;
    tracking?: Record<string, string>;
    leading?: Record<string, string>;
    radius?: Record<string, string>;
    shadow?: Record<string, string | string[]>;
    insetShadow?: Record<string, string | string[]>;
    dropShadow?: Record<string, string | string[]>;
    textShadow?: Record<string, string | string[]>;
    ease?: Record<string, string>;
    animate?: Record<string, string>;
    blur?: Record<string, string>;
    perspective?: Record<string, string>;
    textStrokeWidth?: Record<string, string>;
    property?: Record<string, string>;
    default?: Record<string, Record<string, string>>;
    animation?: ThemeAnimation;
    duration?: Record<string, string>;
    containers?: {
        center?: boolean;
        padding?: string | Record<string, string>;
        maxWidth?: Record<string, string>;
    };
    aria?: Record<string, string>;
    data?: Record<string, string>;
    media?: Record<string, string>;
    supports?: Record<string, string>;
}

export type { Colors as C, Theme as T, ThemeAnimation as a };
