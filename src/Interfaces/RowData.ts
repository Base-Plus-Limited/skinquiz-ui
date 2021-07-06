import { ProductType } from "./ShopifyProduct";

export interface IRowData {
  productName: string; 
  additionalInfo: string; 
  price: string; 
  id: number;
  productType: ProductType;
}