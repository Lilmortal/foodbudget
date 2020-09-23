import { StatusError } from "../../libs/errors";

export class EmailError extends StatusError {
  constructor(message: string) {
    super(200, message);
    this.type = "EMAIL_ERROR";
  }
}
