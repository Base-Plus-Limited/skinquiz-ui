export default interface ICustomProductDBModel {
  newVariation: IIngredient[] | string;
  recommendedVariation: IIngredient[] | string;
  amended: boolean;
  productId: number;
}

interface IIngredient {
  id: number;
  name: string;
}
