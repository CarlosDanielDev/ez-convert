export class InternalServerError extends Error {
  constructor({ cause }) {
    super("Internal Server Error", {
      cause,
    });
    this.name = "InternalServerError";
    this.action = "Get help from the support team.";
    this.statusCode = 500;
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      action: this.action,
      status_code: this.statusCode,
    };
  }
}
