export default interface ICustomProductDBModel {
  ingredients: IIngredient[];
  amended: boolean;
  productId: number;
}

interface IIngredient {
  id: number;
  name: string;
}
