export type PriceBand = "free" | "budget" | "mid" | "splash";
export type Audience = "toddlers" | "children" | "teens" | "adults" | "dogs";
export type Setting = "indoor" | "outdoor";
export type TimeOfDay = "daytime" | "evening" | "weekend";
export type ExperienceType =
  | "grotto"
  | "panto"
  | "lights"
  | "market"
  | "skating"
  | "tea"
  | "meal"
  | "party"
  | "gathering"
  | "community"
  | "stay";

export interface Experience {
  id: string;
  name: string;
  type: ExperienceType;
  priceBand: PriceBand;
  audiences: Audience[];
  setting: Setting;
  timeOfDay: TimeOfDay[];
  rating: number;
  blurb: string;
}

export const TYPE_LABELS: Record<ExperienceType, string> = {
  grotto: "Santa visits",
  panto: "Theatre & panto",
  lights: "Light trails",
  market: "Christmas markets",
  skating: "Ice skating",
  tea: "Afternoon teas",
  meal: "Meals out",
  party: "Parties",
  gathering: "Family gatherings",
  community: "Carols & community",
  stay: "Trips & stays",
};


export const PRICE_LABELS: Record<PriceBand, string> = {
  free: "Free",
  budget: "Budget",
  mid: "Mid",
  splash: "Splash out",
};

export const AUDIENCE_LABELS: Record<Audience, string> = {
  toddlers: "Toddlers",
  children: "Children",
  teens: "Teens",
  adults: "Adults only",
  dogs: "Dogs",
};

export const SETTING_LABELS: Record<Setting, string> = {
  indoor: "Indoor",
  outdoor: "Outdoor",
};

export const TIME_LABELS: Record<TimeOfDay, string> = {
  daytime: "Daytime",
  evening: "Evening",
  weekend: "Weekend",
};

/** Placeholder catalogue. A future data source can replace this without touching the UI. */
export const EXPERIENCES: Experience[] = [
  {
    id: "e1",
    name: "Woodland Santa's Cabin",
    type: "grotto",
    priceBand: "mid",
    audiences: ["toddlers", "children"],
    setting: "outdoor",
    timeOfDay: ["daytime", "weekend"],
    rating: 4.9,
    blurb: "A lantern-lit walk through the trees to meet Father Christmas in his log cabin.",
  },
  {
    id: "e2",
    name: "Steam Train to the North Pole",
    type: "grotto",
    priceBand: "splash",
    audiences: ["toddlers", "children", "teens"],
    setting: "indoor",
    timeOfDay: ["daytime", "weekend"],
    rating: 4.8,
    blurb: "Cocoa, carols and a golden ticket on a heritage railway — the full storybook treatment.",
  },
  {
    id: "e3",
    name: "Town Square Lights Switch-On",
    type: "lights",
    priceBand: "free",
    audiences: ["toddlers", "children", "teens", "adults"],
    setting: "outdoor",
    timeOfDay: ["evening"],
    rating: 4.3,
    blurb: "Brass band, a countdown and the moment the whole high street glows. Costs nothing.",
  },
  {
    id: "e4",
    name: "Botanical Winter Light Trail",
    type: "lights",
    priceBand: "mid",
    audiences: ["children", "teens", "adults", "dogs"],
    setting: "outdoor",
    timeOfDay: ["evening", "weekend"],
    rating: 4.7,
    blurb: "A mile of illuminated gardens, fire pits and a mulled wine stop halfway round.",
  },
  {
    id: "e5",
    name: "Village Christmas Market",
    type: "market",
    priceBand: "free",
    audiences: ["children", "teens", "adults", "dogs"],
    setting: "outdoor",
    timeOfDay: ["daytime", "weekend"],
    rating: 4.2,
    blurb: "Wooden stalls, roasting chestnuts and a choir at four. Free to wander.",
  },
  {
    id: "e6",
    name: "Riverside German Market",
    type: "market",
    priceBand: "budget",
    audiences: ["teens", "adults"],
    setting: "outdoor",
    timeOfDay: ["evening", "weekend"],
    rating: 4.5,
    blurb: "Bratwurst, glühwein and a Ferris wheel above the water — best after dark.",
  },
  {
    id: "e7",
    name: "Cinderella at the Grand",
    type: "panto",
    priceBand: "mid",
    audiences: ["toddlers", "children", "teens"],
    setting: "indoor",
    timeOfDay: ["daytime", "evening", "weekend"],
    rating: 4.6,
    blurb: "Proper old-fashioned panto with a pumpkin carriage and far too much booing.",
  },
  {
    id: "e8",
    name: "Candlelit Carol Concert",
    type: "community",

    priceBand: "budget",
    audiences: ["adults", "teens"],
    setting: "indoor",
    timeOfDay: ["evening"],
    rating: 4.4,
    blurb: "A cathedral, a thousand candles and the descant on the last verse. Grown-up magic.",
  },
  {
    id: "e9",
    name: "Festive Afternoon Tea",
    type: "tea",
    priceBand: "splash",
    audiences: ["adults"],
    setting: "indoor",
    timeOfDay: ["daytime", "weekend"],
    rating: 4.8,
    blurb: "Mince pie scones, a glass of fizz and a pianist in the corner. Book early.",
  },
  {
    id: "e10",
    name: "Museum Christmas Tea",
    type: "tea",
    priceBand: "mid",
    audiences: ["children", "adults"],
    setting: "indoor",
    timeOfDay: ["daytime"],
    rating: 4.1,
    blurb: "Cake under a Victorian glass roof, with the decorations up and the galleries quiet.",
  },
  {
    id: "e11",
    name: "Cosy Cabin Weekend",
    type: "stay",
    priceBand: "splash",
    audiences: ["adults", "children", "dogs"],
    setting: "indoor",
    timeOfDay: ["weekend"],
    rating: 4.9,
    blurb: "Log burner, hot tub, dog by the fire — two nights of doing absolutely nothing.",
  },
  {
    id: "e12",
    name: "Frosty Morning Reindeer Walk",
    type: "stay",
    priceBand: "budget",
    audiences: ["toddlers", "children", "dogs"],
    setting: "outdoor",
    timeOfDay: ["daytime", "weekend"],
    rating: 4.0,
    blurb: "A short, easy trail with real reindeer at the end and hot chocolate to finish.",
  },
];
