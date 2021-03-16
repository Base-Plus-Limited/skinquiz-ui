export interface IErrorResponse {
  error: boolean;
  code: number;
  wordpressCode?: string;
  message: string;
  uiMessage?: string;
}