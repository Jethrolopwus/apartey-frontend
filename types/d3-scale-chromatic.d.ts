// src/types/d3-scale-chromatic.d.ts
declare module "d3-scale-chromatic" {
  // Sequential single-hue
  export const interpolateBlues: (t: number) => string;
  export const interpolateGreens: (t: number) => string;
  export const interpolateGreys: (t: number) => string;
  export const interpolateOranges: (t: number) => string;
  export const interpolatePurples: (t: number) => string;
  export const interpolateReds: (t: number) => string;

  // Sequential multi-hue
  export const interpolateTurbo: (t: number) => string;
  export const interpolateViridis: (t: number) => string;
  export const interpolateInferno: (t: number) => string;
  export const interpolateMagma: (t: number) => string;
  export const interpolatePlasma: (t: number) => string;
  export const interpolateCividis: (t: number) => string;
  export const interpolateWarm: (t: number) => string;
  export const interpolateCool: (t: number) => string;
  export const interpolateCubehelixDefault: (t: number) => string;
  export const interpolateYlGn: (t: number) => string;
  export const interpolateYlGnBu: (t: number) => string;
  export const interpolateYlOrBr: (t: number) => string;
  export const interpolateYlOrRd: (t: number) => string; // ✅ this one

  // Diverging
  export const interpolateBrBG: (t: number) => string;
  export const interpolatePRGn: (t: number) => string;
  export const interpolatePiYG: (t: number) => string;
  export const interpolatePuOr: (t: number) => string;
  export const interpolateRdBu: (t: number) => string;
  export const interpolateRdGy: (t: number) => string;
  export const interpolateRdYlBu: (t: number) => string;
  export const interpolateRdYlGn: (t: number) => string;
  export const interpolateSpectral: (t: number) => string;

  // Categorical schemes
  export const schemeCategory10: string[];
  export const schemeAccent: string[];
  export const schemeDark2: string[];
  export const schemePaired: string[];
  export const schemePastel1: string[];
  export const schemePastel2: string[];
  export const schemeSet1: string[];
  export const schemeSet2: string[];
  export const schemeSet3: string[];
}
