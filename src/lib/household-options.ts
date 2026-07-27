export interface Option {
  value: string;
  label: string;
  emoji: string;
  /** short helper text used on the personalised welcome panel */
  hint: string;
}

export const HOUSEHOLD_TYPES: Option[] = [
  { value: "young_children", label: "A family with young children", emoji: "🧸", hint: "Father Christmas, Eve boxes, school plays and early bedtimes." },
  { value: "teenagers", label: "A family with teenagers", emoji: "🎧", hint: "Traditions that still feel cool — outings, films and thoughtful gifts." },
  { value: "mixed_ages", label: "A family with a mixture of ages", emoji: "👨‍👩‍👧‍👦", hint: "Something magical for everyone — from little ones to grandparents." },
  { value: "couple", label: "A couple", emoji: "💞", hint: "Cosy meals, gentle traditions and a relaxed Christmas together." },
  { value: "adults_no_children", label: "Adults celebrating without children", emoji: "🥂", hint: "Grown-up food, films, games and a slower, softer Christmas." },
  { value: "young_adults", label: "Young adults who still love the traditions", emoji: "🎄", hint: "The magic without the childish bits — nostalgia done beautifully." },
  { value: "alone", label: "Celebrating alone", emoji: "🕯️", hint: "Comforting, kind plans just for you — food, films and little joys." },
  { value: "extended", label: "Hosting extended family or friends", emoji: "🏡", hint: "Guest lists, dietary needs, seating and stress-free timings." },
  { value: "other", label: "Something else", emoji: "✨", hint: "Your own kind of Christmas — we'll keep suggestions gentle." },
];

export const CELEBRATION_STYLES: Option[] = [
  { value: "hosting", label: "Hosting Christmas Day", emoji: "🍽️", hint: "We'll help with guests, food orders and timings." },
  { value: "visiting", label: "Visiting someone else", emoji: "🚗", hint: "Gifts to take, packing lists and travel timings." },
  { value: "quiet_home", label: "A quiet Christmas at home", emoji: "🛋️", hint: "Cosy plans, comfort food and soft traditions." },
  { value: "multiple", label: "Several different celebrations", emoji: "📅", hint: "We'll help juggle days, people and places." },
  { value: "unsure", label: "Not sure yet", emoji: "🤔", hint: "That's OK — pick this and we'll keep things flexible." },
];
