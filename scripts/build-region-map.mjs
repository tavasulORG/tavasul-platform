// Usage: node scripts/build-region-map.mjs <ne_110m_admin_0_countries.geojson> data/regionMap.ts
// Source: https://github.com/nvkelso/natural-earth-vector/blob/master/geojson/ne_110m_admin_0_countries.geojson (public domain).
// Projects the countries (Mercator) into a 1000-unit-wide viewBox covering Africa, the
// Middle East and Turkey, and writes the static SVG path data used by the where-we-work map.
import fs from "node:fs";

const [, , src, out] = process.argv;
const geo = JSON.parse(fs.readFileSync(src, "utf8"));

const LON = [-20, 67];
const LAT = [-36, 44.5];
const W = 1000;

// Only countries that fit the frame are drawn, so the map's outline follows borders and
// coasts instead of the rectangular viewBox: all of Africa, Turkey's Balkan neighbours,
// and Asia west of Afghanistan (label point inside the frame).
const EUROPE_KEEP = new Set(["GRC", "BGR", "ALB", "MKD", "KOS", "MNE", "CYP", "CYN"]);
const ASIA_DROP = new Set(["AFG", "UZB", "KAZ", "PAK", "IND"]);
function wanted(p) {
  if (p.CONTINENT === "Africa") return true;
  if (p.CONTINENT === "Europe") return EUROPE_KEEP.has(p.ADM0_A3);
  if (p.CONTINENT === "Asia") return !ASIA_DROP.has(p.ADM0_A3) && p.LABEL_X <= LON[1] && p.LABEL_Y <= LAT[1];
  return false;
}
const rad = (d) => (d * Math.PI) / 180;
const mercY = (lat) => Math.log(Math.tan(Math.PI / 4 + rad(lat) / 2));
const k = W / rad(LON[1] - LON[0]);
const yTop = mercY(LAT[1]);
const H = Math.round((yTop - mercY(LAT[0])) * k);
const X = (lon) => Math.round(rad(lon - LON[0]) * k);
const Y = (lat) => Math.round((yTop - mercY(lat)) * k);

function ringBox(ring) {
  let a = Infinity, b = Infinity, c = -Infinity, d = -Infinity;
  for (const [lon, lat] of ring) {
    if (lon < a) a = lon; if (lat < b) b = lat; if (lon > c) c = lon; if (lat > d) d = lat;
  }
  return [a, b, c, d];
}
const intersects = ([a, b, c, d]) => !(c < LON[0] || a > LON[1] || d < LAT[0] || b > LAT[1]);

function ringPath(ring) {
  const pts = [];
  for (const [lon, lat] of ring) {
    const x = X(lon), y = Y(lat);
    const last = pts[pts.length - 1];
    if (!last || last[0] !== x || last[1] !== y) pts.push([x, y]);
  }
  if (pts.length < 4) return null;
  return "M" + pts.map(([x, y], i) => (i === 0 ? `${x} ${y}` : `L${x} ${y}`)).join("") + "Z";
}

const countries = [];
const boxes = {}; // code -> [minX,minY,maxX,maxY] in viewBox units
const continents = {};
for (const f of geo.features) {
  if (!wanted(f.properties)) continue;
  const code = f.properties.ADM0_A3;
  const polys = f.geometry.type === "Polygon" ? [f.geometry.coordinates] : f.geometry.coordinates;
  const parts = [];
  let box = [Infinity, Infinity, -Infinity, -Infinity];
  for (const poly of polys) {
    const [a, b, c, d] = ringBox(poly[0]);
    if (!intersects([a, b, c, d])) continue;
    // Skip specks (small islands) narrower than ~3 units.
    if ((X(c) - X(a)) < 3 && (Y(b) - Y(d)) < 3) continue;
    for (const ring of poly) {
      const p = ringPath(ring);
      if (p) parts.push(p);
    }
    box = [Math.min(box[0], X(a)), Math.min(box[1], Y(d)), Math.max(box[2], X(c)), Math.max(box[3], Y(b))];
  }
  if (parts.length === 0) continue;
  countries.push({ code, name: f.properties.NAME, d: parts.join("") });
  boxes[code] = box;
  continents[code] = f.properties.CONTINENT;
}

const REGIONS = {
  turkey: { codes: ["TUR"], pin: [35.2, 39.0] },
  syria: { codes: ["SYR"], pin: [38.5, 35.0] },
  palestine: { codes: ["PSX"], pin: [34.45, 31.45] },
  yemen: { codes: ["YEM"], pin: [47.5, 15.5] },
  africa: { codes: ["MRT", "NER", "TCD", "SOM"], pin: [18.7, 15.4] },
};

const unionBox = (codes) =>
  codes.reduce(
    (acc, c) => (boxes[c] ? [Math.min(acc[0], boxes[c][0]), Math.min(acc[1], boxes[c][1]), Math.max(acc[2], boxes[c][2]), Math.max(acc[3], boxes[c][3])] : acc),
    [Infinity, Infinity, -Infinity, -Infinity]
  );

const africaCodes = countries.filter((c) => continents[c.code] === "Africa").map((c) => c.code);

const lines = [];
lines.push(`import type { CountrySlug } from "@/types";`);
lines.push(``);
lines.push(`/**`);
lines.push(` * Generated from Natural Earth 1:110m admin-0 countries (public domain), Mercator`);
lines.push(` * projection over lon ${LON[0]}..${LON[1]}, lat ${LAT[0]}..${LAT[1]}, rounded to a ${W}-unit-wide viewBox.`);
lines.push(` * Regenerate with scripts/build-region-map.mjs rather than editing the paths by hand.`);
lines.push(` */`);
lines.push(`export const MAP_WIDTH = ${W};`);
lines.push(`export const MAP_HEIGHT = ${H};`);
lines.push(`export const MAP_VIEWBOX = "0 0 ${W} ${H}";`);
lines.push(``);
lines.push(`export interface MapCountry {`);
lines.push(`  /** Natural Earth ADM0_A3 code. */`);
lines.push(`  code: string;`);
lines.push(`  d: string;`);
lines.push(`}`);
lines.push(``);
lines.push(`export const mapCountries: MapCountry[] = [`);
for (const c of countries) lines.push(`  { code: "${c.code}", d: "${c.d}" },`);
lines.push(`];`);
lines.push(``);
lines.push(`/** Countries highlighted for each region of data/regions.ts. */`);
lines.push(`export const regionCountryCodes: Record<CountrySlug, string[]> = {`);
for (const [slug, r] of Object.entries(REGIONS)) lines.push(`  ${slug}: [${r.codes.map((c) => `"${c}"`).join(", ")}],`);
lines.push(`};`);
lines.push(``);
lines.push(`/** Pin position of each region in viewBox units. */`);
lines.push(`export const regionPins: Record<CountrySlug, { x: number; y: number }> = {`);
for (const [slug, r] of Object.entries(REGIONS)) lines.push(`  ${slug}: { x: ${X(r.pin[0])}, y: ${Y(r.pin[1])} },`);
lines.push(`};`);
lines.push(``);
lines.push(`/** Bounding box (x, y, width, height) of each region's highlighted countries. */`);
lines.push(`export const regionBoxes: Record<CountrySlug, { x: number; y: number; w: number; h: number }> = {`);
for (const [slug, r] of Object.entries(REGIONS)) {
  const b = unionBox(r.codes);
  lines.push(`  ${slug}: { x: ${b[0]}, y: ${b[1]}, w: ${b[2] - b[0]}, h: ${b[3] - b[1]} },`);
}
lines.push(`};`);
lines.push(``);
lines.push(`/** Every African country in the map, for drawing the continent as one silhouette. */`);
lines.push(`export const africaCountryCodes: string[] = [${africaCodes.map((c) => `"${c}"`).join(", ")}];`);
lines.push(``);
fs.writeFileSync(out, lines.join("\n"));

const missing = Object.values(REGIONS).flatMap((r) => r.codes).filter((c) => !boxes[c]);
console.log(`countries: ${countries.length}, viewBox ${W}x${H}, bytes ${fs.statSync(out).size}, missing: ${missing.join(",") || "none"}`);
console.log("pins:", Object.fromEntries(Object.entries(REGIONS).map(([s, r]) => [s, [X(r.pin[0]), Y(r.pin[1])]])));
console.log("boxes:", Object.fromEntries(Object.entries(REGIONS).map(([s, r]) => [s, unionBox(r.codes)])));
console.log("largest paths:", countries.map((c) => [c.code, c.d.length]).sort((a, b) => b[1] - a[1]).slice(0, 6));
