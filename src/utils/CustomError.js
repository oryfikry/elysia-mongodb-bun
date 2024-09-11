// src/utils/CustomError.js
export class CustomError extends Error {
  constructor(message, status) {
    this(message);
    this.status = status;
    this.name = this.constructor.name;
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      status: this.status,
    };
  }
}
