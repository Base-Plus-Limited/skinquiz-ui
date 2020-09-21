export interface IAnalyticsEvent {
  distinct_id: string; 
  event_type: EventType;
  question_id?: number;
  ingredients?: string;
  amendSelected?: boolean;
}

export type EventType = "Name entered" | "Quiz started" | "Quiz completed - Amend" | "Quiz completed - Buy Now" | "Question answered" | "Back selected";