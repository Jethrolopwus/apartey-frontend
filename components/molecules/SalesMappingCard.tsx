"use client";
import React, { useMemo, useState } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  ZoomableGroup,
} from "react-simple-maps";
import { scaleLinear } from "d3-scale";
import { interpolateYlOrRd } from "d3-scale-chromatic";
import type { Feature, Geometry } from "geojson";

export interface SalesMappingCardProps {
  countrySales: Array<{ country: string; listings: number }>;
}

export interface CountrySalesItem {
  country: string;
  listings: number;
}

interface GeoJsonProperties {
  NAME?: string;
  [key: string]: unknown;
}

const GEO_URL =
  "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

const SalesMappingCard: React.FC<SalesMappingCardProps> = ({ countrySales }) => {
  const [tooltip, setTooltip] = useState<{
    x: number;
    y: number;
    text: string;
  } | null>(null);

  // Build a quick lookup: Country Name -> listings
  const salesByName = useMemo(() => {
    const obj: Record<string, number> = {};
    countrySales.forEach(({ country, listings }) => {
      obj[country] = listings;
    });
    return obj;
  }, [countrySales]);

  const values = Object.values(salesByName);
  const minVal = values.length ? Math.min(...values) : 0;
  const maxVal = values.length ? Math.max(...values) : 1;

  const colorScale = useMemo(
    () =>
      scaleLinear<string>()
        .domain([minVal, (minVal + maxVal) / 2, maxVal])
        .range([
          interpolateYlOrRd(0.2),
          interpolateYlOrRd(0.6),
          interpolateYlOrRd(1),
        ]),
    [minVal, maxVal]
  );

  const onGeographyHover = (
    geo: Feature<Geometry, GeoJsonProperties>,
    evt: React.MouseEvent<SVGPathElement>
  ) => {
    const name = geo.properties?.NAME ?? "Unknown";
    const val = salesByName[name] ?? 0;

    if (!val) {
      setTooltip(null);
      return;
    }

    setTooltip({
      x: evt.clientX,
      y: evt.clientY,
      text: `${name}: ${val}`,
    });
  };

  return (
    <div className="bg-white rounded-xl p-4 md:p-6 shadow-sm border border-gray-100">
      <div className="mb-4 md:mb-6">
        <h3 className="text-base md:text-lg font-semibold text-gray-800 mb-1">
          Sales Mapping by Country
        </h3>
        <p className="text-xs md:text-sm text-gray-500">
          Global property sales distribution
        </p>
      </div>

      {/* World Heatmap */}
      <div className="relative bg-gray-50 rounded-lg h-64 overflow-hidden">
        <ComposableMap
          projectionConfig={{ scale: 130 }}
          width={800}
          height={400}
          style={{ width: "100%", height: "100%" }}
        >
          <ZoomableGroup>
            <Geographies geography={GEO_URL}>
              {({ geographies }: { geographies: Feature<Geometry, GeoJsonProperties>[] }) =>
                geographies.map((geo) => {
                  const name = geo.properties?.NAME ?? "Unknown";
                  const val = salesByName[name] ?? 0;
                  const fill = val ? colorScale(val) : "#E5E7EB";

                  return (
                    <Geography
                      key={geo.id ?? name}
                      geography={geo}
                      onMouseEnter={(evt) => onGeographyHover(geo, evt)}
                      onMouseMove={(evt) => onGeographyHover(geo, evt)}
                      onMouseLeave={() => setTooltip(null)}
                      style={{
                        default: {
                          fill,
                          stroke: "#D1D5DB",
                          strokeWidth: 0.3,
                          outline: "none",
                        },
                        hover: {
                          fill,
                          outline: "none",
                          cursor: "pointer",
                        },
                        pressed: { outline: "none" },
                      }}
                    />
                  );
                })
              }
            </Geographies>
          </ZoomableGroup>
        </ComposableMap>

        {/* Tooltip */}
        {tooltip && (
          <div
            className="pointer-events-none fixed z-50 bg-black/80 text-white px-2 py-1 rounded text-xs"
            style={{
              top: tooltip.y + 12,
              left: tooltip.x + 12,
            }}
          >
            {tooltip.text}
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="flex justify-center gap-2 md:gap-3 flex-wrap mt-4">
        {countrySales.map((c) => (
          <div
            key={c.country}
            className="flex items-center gap-1 md:gap-2 text-xs text-gray-600"
          >
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: colorScale(c.listings) }}
            />
            <span className="font-medium">{c.country}</span>
            <span className="text-gray-500">({c.listings})</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SalesMappingCard;
