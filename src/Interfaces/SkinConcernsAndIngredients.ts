import { IShopifyUIProduct } from "./ShopifyProduct";

export interface ISkinConcernsAndIngredients { 
  concernOne: string;
  concernTwo: string;
  ingredientsOne: IShopifyUIProduct[];
  ingredientsTwo: IShopifyUIProduct[];
}