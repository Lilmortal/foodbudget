import { StatusError } from "../../../libs/errors";

export class RecipeCreateFailedError extends StatusError {
  constructor(message: string) {
    super(200, message);
    this.type = "RECIPE_CREATE_FAILED";
  }
}
