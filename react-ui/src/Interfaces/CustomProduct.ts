export default interface ICustomProductDBModel {
  ingredients: IIngredient[];
  amended: boolean;
}

interface IIngredient {
  id: number;
  name: string;
}
