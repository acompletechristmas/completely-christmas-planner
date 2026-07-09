// Curated "Never Miss Christmas" milestones.
// Dates are relative to the upcoming Christmas — a fresh set is generated each year.

export type ReminderSeed = {
  slug: string;
  title: string;
  category: "book" | "order" | "post" | "prepare" | "family";
  // Month/day the user should be nudged.
  remindMonth: number; // 1-12
  remindDay: number;
  notes: string;
};

export const REMINDER_SEEDS: ReminderSeed[] = [
  {
    slug: "santa",
    title: "Book Santa's grotto",
    category: "book",
    remindMonth: 9,
    remindDay: 1,
    notes: "The best grottos sell out by early October — pick a date now.",
  },
  {
    slug: "panto",
    title: "Book pantomime tickets",
    category: "book",
    remindMonth: 9,
    remindDay: 15,
    notes: "Weekend matinees for popular pantos disappear first.",
  },
  {
    slug: "personalised-gifts",
    title: "Order personalised gifts",
    category: "order",
    remindMonth: 10,
    remindDay: 1,
    notes: "Engraving, embroidery and photo books need 4–6 weeks.",
  },
  {
    slug: "markets",
    title: "Plan Christmas markets & light trails",
    category: "book",
    remindMonth: 10,
    remindDay: 15,
    notes: "Book light trail slots — evening times sell out fastest.",
  },
  {
    slug: "turkey",
    title: "Order the turkey",
    category: "order",
    remindMonth: 11,
    remindDay: 1,
    notes: "Free-range and heritage birds sell out from mid-November.",
  },
  {
    slug: "supermarket-delivery",
    title: "Book supermarket delivery slot",
    category: "book",
    remindMonth: 11,
    remindDay: 15,
    notes: "Christmas delivery slots open Nov — pick yours before it's gone.",
  },
  {
    slug: "cards-write",
    title: "Write Christmas cards",
    category: "prepare",
    remindMonth: 11,
    remindDay: 20,
    notes: "Get the list together and start writing this week.",
  },
  {
    slug: "post-2nd",
    title: "Post 2nd class Christmas cards",
    category: "post",
    remindMonth: 12,
    remindDay: 8,
    notes: "Royal Mail 2nd class last posting date is mid-December.",
  },
  {
    slug: "post-1st",
    title: "Post 1st class Christmas cards",
    category: "post",
    remindMonth: 12,
    remindDay: 15,
    notes: "Last posting for 1st class within the UK.",
  },
  {
    slug: "wrap-gifts",
    title: "Wrap the final gifts",
    category: "prepare",
    remindMonth: 12,
    remindDay: 20,
    notes: "Set aside an evening with a film and mulled wine.",
  },
  {
    slug: "christmas-eve-box",
    title: "Christmas Eve box ready",
    category: "family",
    remindMonth: 12,
    remindDay: 23,
    notes: "PJs, film, hot chocolate, a book — put it together tonight.",
  },
];

/** The Christmas year that is still upcoming from `today`. */
export function upcomingChristmasYear(today = new Date()): number {
  const y = today.getFullYear();
  const past = today > new Date(y, 11, 25);
  return past ? y + 1 : y;
}

export function seedDatesFor(year: number, seed: ReminderSeed) {
  const remindOn = new Date(year, seed.remindMonth - 1, seed.remindDay);
  const target = new Date(year, 11, 25);
  return {
    remind_on: remindOn.toISOString().slice(0, 10),
    target_date: target.toISOString().slice(0, 10),
  };
}
