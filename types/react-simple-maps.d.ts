// src/types/react-simple-maps.d.ts
declare module "react-simple-maps" {
  import * as React from "react";

  export interface GeographyProps {
    geography: any;
    style?: any;
    onMouseEnter?: (event: React.MouseEvent<SVGPathElement, MouseEvent>) => void;
    onMouseLeave?: (event: React.MouseEvent<SVGPathElement, MouseEvent>) => void;
    onMouseMove?: (event: React.MouseEvent<SVGPathElement, MouseEvent>) => void;
  }

  export const ComposableMap: React.FC<any>;
  export const Geographies: React.FC<any>;
  export const Geography: React.FC<GeographyProps>;
  export const ZoomableGroup: React.FC<any>;
}
