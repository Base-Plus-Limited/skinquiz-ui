import { IIngredient } from "./WordpressProduct";

export interface ISkinConcernsAndIngredients { 
  concernOne: string;
  concernTwo: string;
  ingredientsOne: IIngredient[];
  ingredientsTwo: IIngredient[];
}