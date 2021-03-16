import { ProductType } from "./WordpressProduct";

export interface IRowData {
  productName: string; 
  additionalInfo: string; 
  price: string; 
  id: number;
  productType: ProductType;
}