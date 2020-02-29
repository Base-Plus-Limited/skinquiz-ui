export interface IAnalyticsEvent {
  distinct_id: string; 
  event_type: EventType;
  question_id?: number;
  ingredients?: string;
}

export type EventType = "Name entered" | "Quiz started" | "Quiz completed" | "Amend selected" | "Buy now selected" | "Question answered" | "Back selected";