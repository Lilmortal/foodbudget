export default class EmailError extends Error {
  status: number;

  constructor(message: string) {
    super(message);
    this.status = 500;
  }
}
