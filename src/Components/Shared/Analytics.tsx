import { IAnalyticsEvent } from "../../Interfaces/Analytics";

export const track = async (event: IAnalyticsEvent) => {
  return fetch('https://diagnostic-tool-staging.herokuapp.com/api/analytics', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    cache: 'no-cache',
    body: JSON.stringify({
      event_type: event.event_type,
      distinct_id: event.distinct_id,
      question_id: event.question_id,
      variation: event.variation,
      serumId: event.serumId
    })
  }).then()
  .catch((error) => console.error(error))
}

export const generateUniqueId = () => {
  return btoa(Math.random().toString()).substring(0,12)
}