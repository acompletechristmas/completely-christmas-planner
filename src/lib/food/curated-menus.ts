import type { MealKey } from "./constants";

/**
 * Curated Christmas food suggestions. Deliberately dish names only — no
 * recipes, no links, no prices. Accepting a suggestion writes an ordinary
 * food_items row, so there is only ever one food plan.
 */
export interface MenuStyle {
  key: string;
  label: string;
  blurb: string;
}

export interface Suggestion {
  key: string;
  name: string;
  meal: MealKey;
  course: string;
  dietary_tags?: string[];
  note?: string;
}

export const MENU_STYLES: MenuStyle[] = [
  { key: "traditional", label: "Traditional Christmas", blurb: "The full works, done properly." },
  { key: "easy", label: "Easy / low stress", blurb: "Make-ahead and forgiving." },
  { key: "budget", label: "Budget friendly", blurb: "Generous without the big spend." },
  { key: "luxury", label: "Luxury / special", blurb: "A few showstoppers." },
  { key: "vegetarian", label: "Vegetarian", blurb: "Meat-free and still festive." },
  { key: "buffet", label: "Buffet / picky bits", blurb: "Grazing all afternoon." },
  { key: "family", label: "Family friendly", blurb: "Things children actually eat." },
  { key: "different", label: "Something different", blurb: "A break from tradition." },
];

type StyleKey = (typeof MENU_STYLES)[number]["key"];

const M: Record<string, Suggestion[]> = {
  traditional: [
    { key: "trad-smoked-salmon", name: "Smoked salmon with lemon", meal: "dinner", course: "Starters" },
    { key: "trad-prawn-cocktail", name: "Prawn cocktail", meal: "dinner", course: "Starters" },
    { key: "trad-turkey", name: "Roast turkey with all the trimmings", meal: "dinner", course: "Main" },
    { key: "trad-pigs", name: "Pigs in blankets", meal: "dinner", course: "Sides" },
    { key: "trad-roasties", name: "Roast potatoes", meal: "dinner", course: "Sides" },
    { key: "trad-sprouts", name: "Sprouts with bacon", meal: "dinner", course: "Sides" },
    { key: "trad-stuffing", name: "Sage & onion stuffing", meal: "dinner", course: "Sides" },
    { key: "trad-bread-sauce", name: "Bread sauce", meal: "dinner", course: "Sides" },
    { key: "trad-pudding", name: "Christmas pudding & brandy butter", meal: "desserts", course: "Desserts" },
    { key: "trad-trifle", name: "Sherry trifle", meal: "desserts", course: "Desserts" },
    { key: "trad-mulled", name: "Mulled wine", meal: "drinks", course: "Drinks" },
    { key: "trad-fizz", name: "Something fizzy for the toast", meal: "drinks", course: "Drinks" },
  ],
  easy: [
    { key: "easy-soup", name: "Make-ahead spiced parsnip soup", meal: "dinner", course: "Starters", note: "Freezes well" },
    { key: "easy-crown", name: "Turkey crown (quicker to cook)", meal: "dinner", course: "Main" },
    { key: "easy-gammon", name: "Slow-cooker gammon", meal: "dinner", course: "Main" },
    { key: "easy-frozen-roasties", name: "Good frozen roast potatoes", meal: "dinner", course: "Sides" },
    { key: "easy-traybake-veg", name: "One-tray honey roast vegetables", meal: "dinner", course: "Sides" },
    { key: "easy-red-cabbage", name: "Braised red cabbage (make 2 days ahead)", meal: "dinner", course: "Sides" },
    { key: "easy-cheesecake", name: "No-bake Baileys cheesecake", meal: "desserts", course: "Desserts" },
    { key: "easy-icecream", name: "Ice cream with warm mince pies", meal: "desserts", course: "Desserts" },
    { key: "easy-batch-cocktail", name: "Batch-made Christmas punch", meal: "drinks", course: "Drinks" },
  ],
  budget: [
    { key: "bud-soup", name: "Homemade tomato & basil soup", meal: "dinner", course: "Starters" },
    { key: "bud-chicken", name: "Roast chicken with lemon & thyme", meal: "dinner", course: "Main" },
    { key: "bud-pork", name: "Slow-roast pork shoulder", meal: "dinner", course: "Main" },
    { key: "bud-roasties", name: "Roast potatoes in goose fat", meal: "dinner", course: "Sides" },
    { key: "bud-carrots", name: "Honey roast carrots & parsnips", meal: "dinner", course: "Sides" },
    { key: "bud-yorkshires", name: "Yorkshire puddings", meal: "dinner", course: "Sides" },
    { key: "bud-crumble", name: "Apple & blackberry crumble", meal: "desserts", course: "Desserts" },
    { key: "bud-mince-pies", name: "Mince pies with cream", meal: "desserts", course: "Desserts" },
    { key: "bud-squash", name: "Homemade lemonade & squash for the children", meal: "drinks", course: "Drinks" },
  ],
  luxury: [
    { key: "lux-oysters", name: "Oysters with shallot vinegar", meal: "dinner", course: "Starters" },
    { key: "lux-scallops", name: "Seared scallops with black pudding", meal: "dinner", course: "Starters" },
    { key: "lux-beef", name: "Rib of beef with red wine gravy", meal: "dinner", course: "Main" },
    { key: "lux-goose", name: "Roast goose with spiced apples", meal: "dinner", course: "Main" },
    { key: "lux-dauphinoise", name: "Potato dauphinoise", meal: "dinner", course: "Sides" },
    { key: "lux-truffle-sprouts", name: "Sprouts with chestnuts & truffle oil", meal: "dinner", course: "Sides" },
    { key: "lux-bombe", name: "Chocolate & clementine bombe", meal: "desserts", course: "Desserts" },
    { key: "lux-cheese", name: "Cheeseboard with quince & port", meal: "desserts", course: "Cheese" },
    { key: "lux-champagne", name: "Champagne", meal: "drinks", course: "Drinks" },
  ],
  vegetarian: [
    { key: "veg-soup", name: "Chestnut & mushroom soup", meal: "dinner", course: "Starters", dietary_tags: ["vegetarian"] },
    { key: "veg-wellington", name: "Mushroom & chestnut wellington", meal: "dinner", course: "Main", dietary_tags: ["vegetarian"] },
    { key: "veg-nutroast", name: "Cranberry & walnut nut roast", meal: "dinner", course: "Main", dietary_tags: ["vegetarian"] },
    { key: "veg-squash", name: "Stuffed butternut squash", meal: "dinner", course: "Main", dietary_tags: ["vegan"] },
    { key: "veg-roasties", name: "Roast potatoes in olive oil", meal: "dinner", course: "Sides", dietary_tags: ["vegan"] },
    { key: "veg-cauli", name: "Cauliflower cheese", meal: "dinner", course: "Sides", dietary_tags: ["vegetarian"] },
    { key: "veg-greens", name: "Garlic greens with almonds", meal: "dinner", course: "Sides", dietary_tags: ["vegan"] },
    { key: "veg-pavlova", name: "Winter berry pavlova", meal: "desserts", course: "Desserts", dietary_tags: ["vegetarian"] },
    { key: "veg-choc-pots", name: "Dark chocolate pots", meal: "desserts", course: "Desserts", dietary_tags: ["vegan"] },
  ],
  buffet: [
    { key: "buf-sandwiches", name: "Turkey & cranberry sandwiches", meal: "buffet", course: "Cold" },
    { key: "buf-quiche", name: "Quiche slices", meal: "buffet", course: "Cold" },
    { key: "buf-salads", name: "Two big salads", meal: "buffet", course: "Cold" },
    { key: "buf-sausage-rolls", name: "Sausage rolls", meal: "buffet", course: "Hot" },
    { key: "buf-wings", name: "Sticky glazed chicken wings", meal: "buffet", course: "Hot" },
    { key: "buf-baked-camembert", name: "Baked camembert with bread", meal: "buffet", course: "Hot" },
    { key: "buf-cheese", name: "Cheeseboard with crackers & chutney", meal: "buffet", course: "Cheese" },
    { key: "buf-brownies", name: "Chocolate brownies", meal: "desserts", course: "Desserts" },
    { key: "buf-fruit", name: "Fruit platter", meal: "desserts", course: "Desserts", dietary_tags: ["vegan"] },
    { key: "buf-punch", name: "Non-alcoholic Christmas punch", meal: "drinks", course: "Drinks" },
  ],
  family: [
    { key: "fam-dippers", name: "Bread & dips to keep everyone going", meal: "snacks", course: "Starters" },
    { key: "fam-chicken", name: "Roast chicken (an easy sell with children)", meal: "dinner", course: "Main" },
    { key: "fam-pigs", name: "Pigs in blankets", meal: "dinner", course: "Sides" },
    { key: "fam-mash", name: "Buttery mashed potato", meal: "dinner", course: "Sides" },
    { key: "fam-sweetcorn", name: "Sweetcorn & peas", meal: "dinner", course: "Sides" },
    { key: "fam-yule", name: "Chocolate yule log", meal: "desserts", course: "Desserts" },
    { key: "fam-jelly", name: "Jelly & ice cream", meal: "desserts", course: "Desserts" },
    { key: "fam-hotchoc", name: "Hot chocolate with marshmallows", meal: "drinks", course: "Drinks" },
    { key: "fam-breakfast", name: "Christmas morning pastries", meal: "breakfast", course: "Breakfast" },
  ],
  different: [
    { key: "dif-seafood", name: "Seafood sharing platter", meal: "dinner", course: "Starters" },
    { key: "dif-curry", name: "Christmas curry feast", meal: "dinner", course: "Main" },
    { key: "dif-fondue", name: "Cheese fondue night", meal: "dinner", course: "Main", dietary_tags: ["vegetarian"] },
    { key: "dif-tapas", name: "Festive tapas spread", meal: "buffet", course: "Sides" },
    { key: "dif-porchetta", name: "Porchetta with fennel", meal: "dinner", course: "Main" },
    { key: "dif-tiramisu", name: "Clementine tiramisu", meal: "desserts", course: "Desserts" },
    { key: "dif-churros", name: "Churros with chocolate", meal: "desserts", course: "Desserts" },
    { key: "dif-negroni", name: "Batch negronis", meal: "drinks", course: "Drinks" },
  ],
};

export function suggestionsFor(style: StyleKey): Suggestion[] {
  return M[style] ?? M.traditional!;
}

/** Course order used to group the suggested menu on screen. */
export const COURSE_ORDER = ["Breakfast", "Starters", "Main", "Cold", "Hot", "Sides", "Cheese", "Desserts", "Drinks"];
