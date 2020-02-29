export interface IAnalyticsEvent {
  distinct_id: string, 
  eventType: EventType, 
  eventData?: any
}

export type EventType = "Name entered" | "Quiz started" | "Quiz completed" | "Amend selected" | "Buy now selected" | "Question answered" | "Back selected";