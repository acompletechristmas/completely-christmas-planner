/** Miles between two lat/lng points. */
export function haversineMiles(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number,
): number {
  const toRad = (d: number) => (d * Math.PI) / 180;
  const R = 3958.8; // Earth radius in miles
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(a));
}

export interface GeoOrigin {
  label: string;
  lat: number;
  lng: number;
}

const POSTCODE_RE = /^[A-Z]{1,2}\d[A-Z\d]?\s*\d[A-Z]{2}$/i;

/**
 * UK geocoding via postcodes.io — free, open, no API key.
 * Accepts a full postcode, an outcode (e.g. "YO1") or a town/city name.
 */
export async function geocodeUk(input: string): Promise<GeoOrigin | null> {
  const q = input.trim();
  if (!q) return null;

  try {
    if (POSTCODE_RE.test(q)) {
      const res = await fetch(
        `https://api.postcodes.io/postcodes/${encodeURIComponent(q.replace(/\s+/g, ""))}`,
      );
      if (res.ok) {
        const json = (await res.json()) as {
          result?: { postcode: string; latitude: number; longitude: number };
        };
        if (json.result) {
          return {
            label: json.result.postcode,
            lat: json.result.latitude,
            lng: json.result.longitude,
          };
        }
      }
    }

    // Outcode (partial postcode) lookup.
    if (/^[A-Z]{1,2}\d[A-Z\d]?$/i.test(q)) {
      const res = await fetch(
        `https://api.postcodes.io/outcodes/${encodeURIComponent(q.replace(/\s+/g, ""))}`,
      );
      if (res.ok) {
        const json = (await res.json()) as {
          result?: { outcode: string; latitude: number; longitude: number };
        };
        if (json.result) {
          return {
            label: json.result.outcode.toUpperCase(),
            lat: json.result.latitude,
            lng: json.result.longitude,
          };
        }
      }
    }

    // Town / city name.
    const res = await fetch(
      `https://api.postcodes.io/places?q=${encodeURIComponent(q)}&limit=1`,
    );
    if (res.ok) {
      const json = (await res.json()) as {
        result?: { name_1: string; latitude: number; longitude: number }[];
      };
      const hit = json.result?.[0];
      if (hit) return { label: hit.name_1, lat: hit.latitude, lng: hit.longitude };
    }
  } catch {
    // Geocoding is best-effort: a failure just means a nationwide search.
    return null;
  }
  return null;
}
