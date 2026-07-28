export type RecipientType = "colleague" | "friend" | "family" | "teacher" | "other";
export type GiftStyle = "funny" | "thoughtful" | "useful" | "food-drink" | "personalised" | "unusual";

export interface SecretSantaGift {
  id: string;
  name: string;
  description: string;
  minPrice: number;
  maxPrice: number;
  recipientTypes: RecipientType[];
  giftStyles: GiftStyle[];
  interests: string[];
  externalUrl?: string;
  affiliateUrl?: string;
  imageUrl?: string;
}

// Placeholder starter list. Swap externalUrl for affiliateUrl when partnerships are added.
export const secretSantaGifts: SecretSantaGift[] = [
  {
    id: "novelty-socks",
    name: "Novelty Christmas socks",
    description: "A silly, snuggly pair to raise a smile on Christmas morning.",
    minPrice: 3,
    maxPrice: 5,
    recipientTypes: ["colleague", "friend", "family", "other"],
    giftStyles: ["funny", "useful"],
    interests: ["fashion", "cosy"],
    externalUrl: "https://www.google.com/search?q=novelty+christmas+socks",
  },
  {
    id: "mini-desk-game",
    name: "Mini desk game",
    description: "Tiny puzzle or arcade game to brighten up a work desk.",
    minPrice: 4,
    maxPrice: 5,
    recipientTypes: ["colleague", "friend", "other"],
    giftStyles: ["funny", "unusual"],
    interests: ["games", "office"],
    externalUrl: "https://www.google.com/search?q=mini+desk+game+gift",
  },
  {
    id: "hot-choc-stirrer",
    name: "Hot chocolate stirrer",
    description: "A chunky chocolate spoon that melts into a warm winter mug.",
    minPrice: 3,
    maxPrice: 5,
    recipientTypes: ["colleague", "friend", "family", "teacher", "other"],
    giftStyles: ["food-drink", "thoughtful"],
    interests: ["baking", "cosy", "chocolate"],
    externalUrl: "https://www.google.com/search?q=hot+chocolate+stirrer",
  },
  {
    id: "personalised-keyring",
    name: "Personalised keyring",
    description: "A little engraved keepsake with their name or a message.",
    minPrice: 6,
    maxPrice: 10,
    recipientTypes: ["friend", "family", "teacher", "other"],
    giftStyles: ["personalised", "thoughtful"],
    interests: ["keepsakes"],
    externalUrl: "https://www.google.com/search?q=personalised+keyring",
  },
  {
    id: "personalised-mug",
    name: "Personalised mug",
    description: "Their name, a favourite quote or an inside joke on a proper mug.",
    minPrice: 7,
    maxPrice: 12,
    recipientTypes: ["colleague", "friend", "family", "teacher", "other"],
    giftStyles: ["personalised", "useful"],
    interests: ["tea", "coffee", "office"],
    externalUrl: "https://www.google.com/search?q=personalised+mug",
  },
  {
    id: "posh-hot-choc",
    name: "Small posh hot chocolate set",
    description: "Little tin of proper flaked chocolate with marshmallows.",
    minPrice: 6,
    maxPrice: 10,
    recipientTypes: ["colleague", "friend", "family", "teacher", "other"],
    giftStyles: ["food-drink", "thoughtful"],
    interests: ["chocolate", "cosy", "baking"],
    externalUrl: "https://www.google.com/search?q=luxury+hot+chocolate+gift",
  },
  {
    id: "scratch-poster",
    name: "Scratch-off bucket list poster",
    description: "A film, book or travel poster they scratch as they tick things off.",
    minPrice: 10,
    maxPrice: 18,
    recipientTypes: ["friend", "family", "other"],
    giftStyles: ["unusual", "thoughtful"],
    interests: ["films", "books", "travel"],
    externalUrl: "https://www.google.com/search?q=scratch+off+bucket+list+poster",
  },
  {
    id: "book-lover-candle",
    name: "Book-lover candle",
    description: "A cosy candle scented like an old library or a favourite story.",
    minPrice: 12,
    maxPrice: 18,
    recipientTypes: ["friend", "family", "teacher", "other"],
    giftStyles: ["thoughtful", "unusual"],
    interests: ["books", "reading", "cosy"],
    externalUrl: "https://www.google.com/search?q=book+lover+candle",
  },
  {
    id: "personalised-photo-coaster",
    name: "Personalised photo coaster set",
    description: "A little set of coasters printed with a favourite photo.",
    minPrice: 12,
    maxPrice: 20,
    recipientTypes: ["family", "friend", "teacher", "other"],
    giftStyles: ["personalised", "thoughtful", "useful"],
    interests: ["keepsakes", "home"],
    externalUrl: "https://www.google.com/search?q=personalised+photo+coasters",
  },
  {
    id: "artisan-choc-bar",
    name: "Artisan chocolate bar bundle",
    description: "Three fancy chocolate bars from small makers.",
    minPrice: 10,
    maxPrice: 18,
    recipientTypes: ["colleague", "friend", "family", "teacher", "other"],
    giftStyles: ["food-drink", "thoughtful"],
    interests: ["chocolate", "food"],
    externalUrl: "https://www.google.com/search?q=artisan+chocolate+gift+set",
  },
  {
    id: "mini-plant",
    name: "Mini desk plant",
    description: "A tiny succulent or pot herb for their desk or windowsill.",
    minPrice: 8,
    maxPrice: 15,
    recipientTypes: ["colleague", "friend", "teacher", "other"],
    giftStyles: ["thoughtful", "useful", "unusual"],
    interests: ["gardening", "plants", "office"],
    externalUrl: "https://www.google.com/search?q=mini+desk+plant+gift",
  },
  {
    id: "funny-notebook",
    name: "Cheeky quote notebook",
    description: "A smart notebook with a very silly quote on the front.",
    minPrice: 6,
    maxPrice: 12,
    recipientTypes: ["colleague", "friend", "teacher", "other"],
    giftStyles: ["funny", "useful"],
    interests: ["writing", "office", "books"],
    externalUrl: "https://www.google.com/search?q=funny+quote+notebook",
  },
];

export function filterSecretSantaGifts(opts: {
  budgetMax: number;
  budgetMin?: number;
  recipient?: RecipientType;
  styles: GiftStyle[];
  interests?: string;
}): SecretSantaGift[] {
  const min = opts.budgetMin ?? 0;
  const kw = (opts.interests ?? "")
    .toLowerCase()
    .split(/[,\s]+/)
    .map((s) => s.trim())
    .filter(Boolean);

  const scored = secretSantaGifts
    .filter((g) => g.minPrice <= opts.budgetMax && g.maxPrice >= min)
    .filter((g) => (opts.recipient ? g.recipientTypes.includes(opts.recipient) : true))
    .map((g) => {
      let score = 0;
      if (opts.styles.length === 0) score += 1;
      else score += g.giftStyles.filter((s) => opts.styles.includes(s)).length;
      if (kw.length) {
        const hay = (g.interests.join(" ") + " " + g.description + " " + g.name).toLowerCase();
        score += kw.filter((k) => hay.includes(k)).length * 2;
      }
      return { g, score };
    })
    .filter((x) => (opts.styles.length === 0 ? true : x.score > 0))
    .sort((a, b) => b.score - a.score);

  return scored.map((x) => x.g);
}
