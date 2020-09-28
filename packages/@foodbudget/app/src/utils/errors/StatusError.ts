export type ErrorType =
  | 'RECIPE_CREATE_FAILED'
  | 'EMAIL_ERROR'
  | 'SCRAPER_ERROR'
  | 'AGENDA_JOB_ERROR'
  | 'REPOSITORY_ERROR';

export class StatusError extends Error {
  status: number;

  type?: ErrorType;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}
