import { IAnalyticsEvent } from "../../Interfaces/Analytics";

export const track = async (event: IAnalyticsEvent) => {
  return fetch('/api/analytics', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    cache: 'no-cache',
    body: JSON.stringify({
      eventType: event.eventType,
      distinct_id: event.distinct_id,
      eventData: event.eventData
    })
  })
  .catch((error) => console.error(error))
}

export const generateUniqueId = () => {
  return btoa(Math.random().toString()).substring(0,12);
}