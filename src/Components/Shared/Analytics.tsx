import { IAnalyticsEvent } from "../../Interfaces/Analytics";
import { getUrlBasedOnEnvironment } from "./EnvironmentHelper";

export const track = async (event: IAnalyticsEvent) => {
  return fetch(`${getUrlBasedOnEnvironment()}/analytics`, {
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

export const generateAnalyticsId = (digits: number) => {
  return btoa(Math.random().toString()).substring(0,digits)
}

export const generateLongUniqueId = () => {
  const idAsArray = (Math.random() * (9 - 1) + 1).toString().split('.');
  return Number(idAsArray[0] + idAsArray[1].substring(1,6));
}