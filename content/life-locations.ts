import { lifeEntries, type LifeEntry } from "./life";

export type CityId = "chongqing" | "guangzhou" | "zhuhai";
export type GermanyNodeId = "frankfurt" | "heidelberg";
export type TransitMode = "bus" | "plane" | "train";

export type LifeLocation = {
  id: CityId;
  label: string;
  role: "HOMETOWN" | "HOME" | "UNIVERSITY";
  region: string;
  description: string;
  coordinates: string;
  elevation: string;
  map: { x: number; y: number };
  photos: LifeEntry[];
  emptyMessage?: string;
};

export type LifeRoute = {
  from: CityId | GermanyNodeId;
  to: CityId | GermanyNodeId;
  mode: TransitMode;
  pathD: string;
};

export type GermanyLocation = {
  id: GermanyNodeId;
  label: string;
  role: "ARRIVAL" | "STUDY";
  map: { x: number; y: number };
};

const dogs = lifeEntries.filter((entry) => entry.group === "dogs");
const places = lifeEntries.filter((entry) => entry.group === "places");
const courtyard = lifeEntries.filter((entry) => entry.group === "courtyard");

export const lifeLocations: Record<CityId, LifeLocation> = {
  chongqing: {
    id: "chongqing",
    label: "CHONGQING",
    role: "HOMETOWN",
    region: "CHONGQING · CHINA",
    description: "Hometown archive coming soon.",
    coordinates: "29°34′N  106°33′E",
    elevation: "ELEV. 259M",
    map: { x: 451, y: 397 },
    photos: [],
    emptyMessage: "Hometown archive coming soon.",
  },
  guangzhou: {
    id: "guangzhou",
    label: "GUANGZHOU",
    role: "HOME",
    region: "GUANGZHOU · GUANGDONG",
    description: "Home, dogs and familiar visitors.",
    coordinates: "23°07′N  113°15′E",
    elevation: "ELEV. 6M",
    map: { x: 522, y: 490 },
    photos: [...dogs, ...courtyard],
  },
  zhuhai: {
    id: "zhuhai",
    label: "ZHUHAI",
    role: "UNIVERSITY",
    region: "ZHUHAI · GUANGDONG",
    description: "Four years between campus, railway and sea.",
    coordinates: "22°16′N  113°34′E",
    elevation: "ELEV. 36M",
    map: { x: 536, y: 520 },
    photos: places,
  },
};

const routes: Record<string, LifeRoute> = {
  "guangzhou-zhuhai": {
    from: "guangzhou",
    to: "zhuhai",
    mode: "bus",
    pathD: "M 522 490 Q 546 500 536 520",
  },
  "zhuhai-guangzhou": {
    from: "zhuhai",
    to: "guangzhou",
    mode: "bus",
    pathD: "M 536 520 Q 546 500 522 490",
  },
  "chongqing-guangzhou": {
    from: "chongqing",
    to: "guangzhou",
    mode: "plane",
    pathD: "M 451 397 C 497 391 528 432 522 490",
  },
  "guangzhou-chongqing": {
    from: "guangzhou",
    to: "chongqing",
    mode: "plane",
    pathD: "M 522 490 C 528 432 497 391 451 397",
  },
  "chongqing-zhuhai": {
    from: "chongqing",
    to: "zhuhai",
    mode: "plane",
    pathD: "M 451 397 C 510 391 545 449 536 520",
  },
  "zhuhai-chongqing": {
    from: "zhuhai",
    to: "chongqing",
    mode: "plane",
    pathD: "M 536 520 C 545 449 510 391 451 397",
  },
};

export const cityIds = Object.keys(lifeLocations) as CityId[];

export const germanyLocations: Record<GermanyNodeId, GermanyLocation> = {
  frankfurt: {
    id: "frankfurt",
    label: "FRANKFURT",
    role: "ARRIVAL",
    map: { x: 214, y: 478 },
  },
  heidelberg: {
    id: "heidelberg",
    label: "HEIDELBERG",
    role: "STUDY",
    map: { x: 236, y: 570 },
  },
};

export const germanyNodeIds = Object.keys(germanyLocations) as GermanyNodeId[];

export const chinaToGermanyRoute: LifeRoute = {
  from: "guangzhou",
  to: "frankfurt",
  mode: "plane",
  pathD: "M 522 490 C 430 474 304 358 92 304",
};

export const frankfurtToHeidelbergRoute: LifeRoute = {
  from: "frankfurt",
  to: "heidelberg",
  mode: "train",
  pathD: "M 214 478 C 218 512 226 538 236 570",
};

export function getLifeRoute(from: CityId, to: CityId): LifeRoute {
  return routes[`${from}-${to}`];
}
