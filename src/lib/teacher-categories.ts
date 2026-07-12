import type { LucideIcon } from "lucide-react";
import {
  BookOpen,
  Palette,
  FileText,
  Scissors,
  PencilLine,
  Dice5,
  HelpCircle,
  Sparkles,
} from "lucide-react";

export interface TeacherCategory {
  slug: string;
  title: string;
  emoji: string;
  icon: LucideIcon;
  blurb: string;
  subcategories: Array<{ slug: string; label: string }>;
}

export const TEACHER_CATEGORIES: TeacherCategory[] = [
  {
    slug: "classroom-activities",
    title: "Classroom Activities",
    emoji: "📚",
    icon: BookOpen,
    blurb: "Ready-to-run lessons across maths, English, science, history, RE, art, music, computing and PE.",
    subcategories: [
      { slug: "maths", label: "Christmas Maths" },
      { slug: "english", label: "Christmas English" },
      { slug: "science", label: "Science Investigations" },
      { slug: "history", label: "History of Christmas" },
      { slug: "geography", label: "Geography Activities" },
      { slug: "re", label: "RE Activities" },
      { slug: "art", label: "Art Lessons" },
      { slug: "music", label: "Music Lessons" },
      { slug: "computing", label: "Computing Activities" },
      { slug: "pe", label: "PE Games" },
    ],
  },
  {
    slug: "colouring",
    title: "Colouring",
    emoji: "🎨",
    icon: Palette,
    blurb: "Printable colouring sheets, colour-by-number, patterns, mindfulness pages, cards and tags.",
    subcategories: [
      { slug: "sheets", label: "Colouring Sheets" },
      { slug: "colour-by-number", label: "Colour by Number" },
      { slug: "patterns", label: "Christmas Patterns" },
      { slug: "mindfulness", label: "Mindfulness Colouring" },
      { slug: "cards", label: "Cards to Colour" },
      { slug: "gift-tags", label: "Gift Tags to Colour" },
    ],
  },
  {
    slug: "worksheets",
    title: "Worksheets",
    emoji: "📝",
    icon: FileText,
    blurb: "Word searches, crosswords, crack-the-code, spot the difference, mazes, handwriting, numeracy.",
    subcategories: [
      { slug: "word-search", label: "Word Searches" },
      { slug: "crosswords", label: "Crosswords" },
      { slug: "crack-the-code", label: "Crack the Code" },
      { slug: "spot-the-difference", label: "Spot the Difference" },
      { slug: "matching", label: "Matching Activities" },
      { slug: "dot-to-dot", label: "Dot-to-Dot" },
      { slug: "mazes", label: "Mazes" },
      { slug: "handwriting", label: "Handwriting Practice" },
      { slug: "alphabet", label: "Alphabet Activities" },
      { slug: "number", label: "Number Activities" },
    ],
  },
  {
    slug: "crafts",
    title: "Christmas Crafts",
    emoji: "🎄",
    icon: Scissors,
    blurb: "Decorations, paper crafts, classroom displays, advent crafts, recycled makes and pupil-made gifts.",
    subcategories: [
      { slug: "decorations", label: "Decorations" },
      { slug: "paper-crafts", label: "Paper Crafts" },
      { slug: "classroom-displays", label: "Classroom Displays" },
      { slug: "advent-crafts", label: "Advent Crafts" },
      { slug: "recycled-crafts", label: "Recycled Crafts" },
      { slug: "tree-ornaments", label: "Tree Ornaments" },
      { slug: "child-made-gifts", label: "Gifts Children Can Make" },
    ],
  },
  {
    slug: "writing",
    title: "Writing Activities",
    emoji: "🎅",
    icon: PencilLine,
    blurb: "Letters to Santa, diaries, story starters, character work, news reports, persuasive writing, poetry.",
    subcategories: [
      { slug: "letter-to-santa", label: "Letter to Santa" },
      { slug: "diary", label: "Diary Writing" },
      { slug: "story-starters", label: "Story Starters" },
      { slug: "character-descriptions", label: "Character Descriptions" },
      { slug: "newspaper-reports", label: "Newspaper Reports" },
      { slug: "persuasive", label: "Persuasive Writing" },
      { slug: "poetry", label: "Poetry" },
      { slug: "instructions", label: "Instructions" },
      { slug: "creative-prompts", label: "Creative Prompts" },
    ],
  },
  {
    slug: "games",
    title: "Games",
    emoji: "🎲",
    icon: Dice5,
    blurb: "Bingo, class quizzes, team games, escape rooms, treasure hunts, charades and Pictionary.",
    subcategories: [
      { slug: "bingo", label: "Christmas Bingo" },
      { slug: "class-quizzes", label: "Classroom Quizzes" },
      { slug: "team-games", label: "Team Games" },
      { slug: "escape-room", label: "Escape Rooms" },
      { slug: "treasure-hunts", label: "Treasure Hunts" },
      { slug: "would-you-rather", label: "Would You Rather?" },
      { slug: "guess-the-picture", label: "Guess the Picture" },
      { slug: "charades", label: "Christmas Charades" },
      { slug: "pictionary", label: "Christmas Pictionary" },
    ],
  },
  {
    slug: "quizzes",
    title: "Quizzes",
    emoji: "❓",
    icon: HelpCircle,
    blurb: "General knowledge, films, music, cultures, food and drink, logos, pictures, true/false and interactive.",
    subcategories: [
      { slug: "general", label: "General Christmas" },
      { slug: "films", label: "Christmas Films" },
      { slug: "music", label: "Christmas Music" },
      { slug: "around-the-world", label: "Around the World" },
      { slug: "food-drink", label: "Food & Drink" },
      { slug: "guess-the-logo", label: "Guess the Logo" },
      { slug: "picture", label: "Picture Quiz" },
      { slug: "true-or-false", label: "True or False" },
      { slug: "multiple-choice", label: "Multiple Choice" },
      { slug: "interactive", label: "Interactive Digital" },
    ],
  },
  {
    slug: "classroom-extras",
    title: "Classroom Extras",
    emoji: "🎬",
    icon: Sparkles,
    blurb: "Countdowns, daily challenges, jokes, facts, assemblies, reward activities, mindfulness moments.",
    subcategories: [
      { slug: "countdown", label: "Christmas Countdown" },
      { slug: "daily", label: "Daily Challenge" },
      { slug: "jokes", label: "Joke of the Day" },
      { slug: "facts", label: "Christmas Facts" },
      { slug: "assemblies", label: "Assembly Ideas" },
      { slug: "rewards", label: "Reward Activities" },
      { slug: "mindfulness", label: "Calm Mindfulness" },
    ],
  },
];

export function findCategory(slug: string): TeacherCategory | undefined {
  return TEACHER_CATEGORIES.find((c) => c.slug === slug);
}

export function yearGroupLabel(min: number | null, max: number | null): string {
  if (min == null && max == null) return "All ages";
  const label = (y: number | null) => (y == null ? "?" : y === 0 ? "EYFS" : `Y${y}`);
  if (min === max) return label(min);
  return `${label(min)}–${label(max)}`;
}
