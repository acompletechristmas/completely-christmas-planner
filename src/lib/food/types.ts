export interface FoodOccasion {
  id: string;
  user_id: string;
  name: string;
  occasion_date: string | null;
  num_adults: number;
  num_children: number;
  notes: string | null;
  is_default: boolean;
  default_key: string | null;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface FoodItem {
  id: string;
  user_id: string;
  occasion_id: string;
  meal: string;
  name: string;
  servings: number | null;
  dietary_tags: string[];
  responsible_person_id: string | null;
  responsible_name: string | null;
  prep_date: string | null;
  notes: string | null;
  status: string;
  needs_shopping: boolean;
  source: string;
  suggestion_key: string | null;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface FoodGuest {
  id: string;
  user_id: string;
  occasion_id: string;
  person_id: string | null;
  guest_name: string | null;
  dietary_tags: string[];
  dietary_notes: string | null;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface FoodShoppingItem {
  id: string;
  user_id: string;
  item: string;
  quantity: number | null;
  unit: string | null;
  category: string | null;
  bought: boolean;
  food_item_id: string | null;
  notes: string | null;
  sort_order: number;
  created_at: string;
  updated_at: string;
}
