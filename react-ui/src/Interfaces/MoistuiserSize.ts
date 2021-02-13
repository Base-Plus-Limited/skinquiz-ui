export interface IMoisturiserSize {
  size: MoisturiserSizeIds; 
  selected: boolean; 
  id: MoisturiserSizeIds;
}

export type MoisturiserSizeIds = "50ml" | "30ml";