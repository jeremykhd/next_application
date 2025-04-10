export class AppError extends Error {
  constructor(
    message: string,
    public code: string,
    public status: number = 400,
    public details?: Record<string, unknown>
  ) {
    super(message);
    this.name = "AppError";
  }

  static badRequest(message: string, details?: Record<string, unknown>) {
    return new AppError(message, "BAD_REQUEST", 400, details);
  }

  static unauthorized(message: string = "Unauthorized") {
    return new AppError(message, "UNAUTHORIZED", 401);
  }

  static forbidden(message: string = "Forbidden") {
    return new AppError(message, "FORBIDDEN", 403);
  }

  static notFound(message: string = "Not found") {
    return new AppError(message, "NOT_FOUND", 404);
  }

  static conflict(message: string, details?: Record<string, unknown>) {
    return new AppError(message, "CONFLICT", 409, details);
  }

  static internal(message: string = "Internal server error") {
    return new AppError(message, "INTERNAL_ERROR", 500);
  }
}
