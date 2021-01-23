export interface IAnalyticsEvent {
  distinct_id: string; 
  event_type: EventType;
  question_id?: number;
  variation?: string;
  serumId?: number;
  moisturiserId?: number;
  amendSelected?: boolean;
}

export type EventType = "Name entered" | "Quiz started" | "Quiz completed - Amend" | "Quiz completed - Moisturiser Added To Cart" | "Question answered" | "Back selected" | "Quiz completed - Serum Added To Cart" | "Quiz completed - Bundle Added To Cart";