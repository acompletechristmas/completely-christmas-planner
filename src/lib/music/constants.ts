/**
 * Shared vocabulary for My Christmas Music.
 * Values are stored as free text so new options never need a migration.
 */

export const ITEM_TYPES = [
  { key: "song", label: "Song" },
  { key: "album", label: "Album" },
  { key: "playlist_idea", label: "Playlist idea" },
  { key: "artist", label: "Artist" },
  { key: "other", label: "Other" },
] as const;

export function itemTypeLabel(key: string | null | undefined): string {
  if (!key) return "Song";
  return ITEM_TYPES.find((t) => t.key === key)?.label ?? key;
}

/** The moment the music is for — the strongest signal in the recommender. */
export const MOMENTS = [
  { key: "decorating", label: "Decorating the tree" },
  { key: "wrapping", label: "Wrapping presents" },
  { key: "cooking", label: "Cooking & baking" },
  { key: "christmas_eve", label: "Christmas Eve" },
  { key: "christmas_morning", label: "Christmas morning" },
  { key: "christmas_dinner", label: "Christmas dinner" },
  { key: "party", label: "A Christmas party" },
  { key: "singalong", label: "A family singalong" },
  { key: "cosy_evening", label: "A cosy evening in" },
  { key: "travelling", label: "Travelling / in the car" },
  { key: "background", label: "Gentle background music" },
  { key: "any_time", label: "Any time" },
] as const;

export function momentLabel(key: string | null | undefined): string {
  if (!key) return "Any time";
  return MOMENTS.find((m) => m.key === key)?.label ?? key;
}

export const MOMENT_ORDER: string[] = MOMENTS.map((m) => m.key);

export const MUSIC_MOODS = [
  { key: "traditional", label: "Traditional" },
  { key: "choral", label: "Carols & choral" },
  { key: "crooner", label: "Classic crooners" },
  { key: "jazzy", label: "Jazzy & elegant" },
  { key: "nostalgic", label: "Nostalgic" },
  { key: "joyful", label: "Joyful" },
  { key: "party", label: "Party" },
  { key: "singalong", label: "Singalong" },
  { key: "romantic", label: "Romantic" },
  { key: "relaxed", label: "Relaxed" },
  { key: "modern", label: "Something newer" },
  { key: "children", label: "For the children" },
  { key: "comic", label: "Silly & fun" },
] as const;

export function musicMoodLabel(key: string | null | undefined): string {
  if (!key) return "";
  return MUSIC_MOODS.find((m) => m.key === key)?.label ?? key;
}
