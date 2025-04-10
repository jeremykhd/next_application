import { describe, it, expect } from "vitest";
import { AppError } from "../AppError";

describe("AppError", () => {
  it("should create a basic error", () => {
    const error = new AppError("Test error", "TEST_ERROR");
    expect(error).toBeInstanceOf(Error);
    expect(error.message).toBe("Test error");
    expect(error.code).toBe("TEST_ERROR");
    expect(error.status).toBe(400);
    expect(error.name).toBe("AppError");
  });

  it("should create a bad request error", () => {
    const error = AppError.badRequest("Invalid input", { field: "email" });
    expect(error).toBeInstanceOf(AppError);
    expect(error.message).toBe("Invalid input");
    expect(error.code).toBe("BAD_REQUEST");
    expect(error.status).toBe(400);
    expect(error.details).toEqual({ field: "email" });
  });

  it("should create an unauthorized error", () => {
    const error = AppError.unauthorized();
    expect(error).toBeInstanceOf(AppError);
    expect(error.message).toBe("Unauthorized");
    expect(error.code).toBe("UNAUTHORIZED");
    expect(error.status).toBe(401);
  });

  it("should create a forbidden error", () => {
    const error = AppError.forbidden();
    expect(error).toBeInstanceOf(AppError);
    expect(error.message).toBe("Forbidden");
    expect(error.code).toBe("FORBIDDEN");
    expect(error.status).toBe(403);
  });

  it("should create a not found error", () => {
    const error = AppError.notFound();
    expect(error).toBeInstanceOf(AppError);
    expect(error.message).toBe("Not found");
    expect(error.code).toBe("NOT_FOUND");
    expect(error.status).toBe(404);
  });

  it("should create a conflict error", () => {
    const error = AppError.conflict("Resource already exists", { id: "123" });
    expect(error).toBeInstanceOf(AppError);
    expect(error.message).toBe("Resource already exists");
    expect(error.code).toBe("CONFLICT");
    expect(error.status).toBe(409);
    expect(error.details).toEqual({ id: "123" });
  });

  it("should create an internal error", () => {
    const error = AppError.internal();
    expect(error).toBeInstanceOf(AppError);
    expect(error.message).toBe("Internal server error");
    expect(error.code).toBe("INTERNAL_ERROR");
    expect(error.status).toBe(500);
  });
});
