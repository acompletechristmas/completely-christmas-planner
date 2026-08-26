/**
 * Curated collections for My Christmas Watchlist.
 *
 * A collection is NOT a second catalogue. It is a context key that titles opt
 * into via their `strength` map, so one master title record can belong to any
 * number of collections.
 */

import type { CollectionKey } from "./vocabulary";

export interface Collection {
  key: CollectionKey;
  title: string;
  subtitle: string;
  /**
   * When true, Christmas-adjacent titles are favoured over core Christmas
   * films while this collection is selected.
   */
  favoursAdjacent?: boolean;
}

export const COLLECTIONS: Collection[] = [
  {
    key: "secret_christmas",
    title: "Secret Christmas Films",
    subtitle: "Not officially Christmas films — but we all know they are.",
    favoursAdjacent: true,
  },
  {
    key: "christmas_eve_favourites",
    title: "Christmas Eve favourites",
    subtitle: "For the night the whole thing finally begins.",
  },
  {
    key: "christmas_day_afternoon",
    title: "Christmas Day afternoon",
    subtitle: "Full plate, warm room, nobody moving.",
  },
  {
    key: "kids_in_bed",
    title: "When the children are in bed",
    subtitle: "Grown-up Christmas viewing, once the house is quiet.",
  },
  {
    key: "with_teenagers",
    title: "Watching with teenagers",
    subtitle: "Festive enough for you, not embarrassing for them.",
  },
  {
    key: "with_grown_up_children",
    title: "With grown-up children",
    subtitle: "Everyone's an adult now — pick accordingly.",
  },
  {
    key: "everyone_agrees",
    title: "Everyone agrees",
    subtitle: "The rare films that suit the entire room.",
  },
  {
    key: "cosy_night",
    title: "A cosy night in",
    subtitle: "Blanket, lamp on, nothing demanding.",
  },
  {
    key: "christmas_romance",
    title: "Christmas romance",
    subtitle: "Snow, second chances and very good coats.",
  },
  {
    key: "christmas_classics",
    title: "Christmas classics",
    subtitle: "The ones that come back every single year.",
  },
  {
    key: "modern_classic",
    title: "Modern classics",
    subtitle: "Newer films that already feel like tradition.",
  },
];

export const COLLECTION_KEYS: CollectionKey[] = COLLECTIONS.map((c) => c.key);

export function getCollection(key: CollectionKey | string): Collection | undefined {
  return COLLECTIONS.find((c) => c.key === key);
}

export function collectionLabel(key: CollectionKey | string): string {
  return getCollection(key)?.title ?? key;
}

export function isCollectionKey(key: string): key is CollectionKey {
  return COLLECTION_KEYS.includes(key as CollectionKey);
}
