import { MoisturiserSizeIds } from "./MoistuiserSize";

export type ProductType = "serum" | "moisturiser" | "bundle";

export interface IShopifyUIProduct extends IShopifyProduct {
  isSelectedForSummary: boolean;
  isDescriptionPanelOpen: boolean;
  isIngredientsPanelOpen: boolean;
  isSelectedForUpsell: boolean;
  ingredients: string;
  variationDescription: string;
  description: string;
  rank: number;
  smallerSizePrice: string;
  selectedSize?: MoisturiserSizeIds;
  showDescription: boolean;
  previouslyRanked: boolean;
  commonlyUsedFor: string[];
  tags_as_array: string[];
  totalPrice: string;
}

export interface IShopifySerum extends IShopifyProduct {
  commonlyUsedFor: string[];
  isSelectedForSummary: boolean;
  isDescriptionPanelOpen: boolean;
  isIngredientsPanelOpen: boolean;
  isSelectedForUpsell: boolean;
  ingredients: string;
  variationDescription: string;
  description: string;
}

export interface IIngredient extends IShopifyProduct {
  rank: number;
  smallerSizePrice: string;
  selectedSize?: MoisturiserSizeIds;
  isIngredientsPanelOpen: boolean;
  isDescriptionPanelOpen: boolean;
  showDescription: boolean;
  previouslyRanked: boolean;
  isSelectedForSummary: boolean;
  commonlyUsedFor: string[];
  ingredients: string;
  description: string;
  tags_as_array: string[];
}

export interface IShopifyProduct {
  id: number;
  title: string;
  body_html: string;
  vendor: string;
  product_type: "moisturiser" | "serum" | "ingredient";
  created_at: Date;
  handle: string;
  updated_at: Date;
  published_at: Date;
  template_suffix: string;
  status: string;
  published_scope: string;
  tags: string;
  admin_graphql_api_id: string;
  variants: Variant[];
  options: Option[];
  images: Image[];
  image: Image | null;
}

export interface Image {
  product_id: number;
  id: number;
  position: number;
  created_at: Date;
  updated_at: Date;
  alt: null;
  width: number;
  height: number;
  src: string;
  variant_ids: any[];
  admin_graphql_api_id: string;
}

export interface Option {
  product_id: number;
  id: number;
  name: string;
  position: number;
  values: string[];
}

export interface Variant {
  product_id: number;
  id: number;
  title: string;
  price: string;
  sku: string;
  position: number;
  inventory_policy: string;
  compare_at_price: null;
  fulfillment_service: string;
  inventory_management: null;
  option1: string;
  option2: null;
  option3: null;
  created_at: Date;
  updated_at: Date;
  taxable: boolean;
  barcode: string;
  grams: number;
  image_id: null;
  weight: number;
  weight_unit: string;
  inventory_item_id: number;
  inventory_quantity: number;
  old_inventory_quantity: number;
  requires_shipping: boolean;
  admin_graphql_api_id: string;
}

export enum SpecialCaseProducts {
  LemonSeedOil = 697,
  TeaTreeOil = 2054,
  Niacinamide = 698,
  VitaminC = 694
}