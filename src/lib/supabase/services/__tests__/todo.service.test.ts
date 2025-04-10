import { describe, it, expect, vi, beforeEach } from "vitest";
import { TodoService } from "../todo.service";
import { mockSupabase } from "../../__tests__/setup";
import { AppError } from "@/lib/errors/AppError";

const mockTodo = {
  id: "1",
  title: "Test Todo",
  completed: false,
  user_id: "user1",
  created_at: "2024-01-01T00:00:00Z",
  updated_at: "2024-01-01T00:00:00Z",
};

describe("TodoService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("create", () => {
    it("should create a todo successfully", async () => {
      mockSupabase.insert.mockResolvedValueOnce({
        data: mockTodo,
        error: null,
      });

      const result = await TodoService.create({
        title: "Test Todo",
        user_id: "user1",
      });

      expect(result).toEqual(mockTodo);
      expect(mockSupabase.insert).toHaveBeenCalledWith({
        title: "Test Todo",
        user_id: "user1",
        completed: false,
      });
    });

    it("should throw an error when creation fails", async () => {
      mockSupabase.insert.mockResolvedValueOnce({
        data: null,
        error: new Error("Database error"),
      });

      await expect(
        TodoService.create({
          title: "Test Todo",
          user_id: "user1",
        })
      ).rejects.toThrow(AppError);
    });
  });

  describe("update", () => {
    it("should update a todo successfully", async () => {
      mockSupabase.update.mockResolvedValueOnce({
        data: { ...mockTodo, title: "Updated Todo" },
        error: null,
      });

      const result = await TodoService.update("1", {
        title: "Updated Todo",
      });

      expect(result.title).toBe("Updated Todo");
      expect(mockSupabase.update).toHaveBeenCalledWith({
        title: "Updated Todo",
      });
    });

    it("should throw not found error when todo does not exist", async () => {
      mockSupabase.update.mockResolvedValueOnce({
        data: null,
        error: null,
      });

      await expect(
        TodoService.update("1", {
          title: "Updated Todo",
        })
      ).rejects.toThrow(AppError);
    });
  });

  describe("delete", () => {
    it("should delete a todo successfully", async () => {
      mockSupabase.delete.mockResolvedValueOnce({
        error: null,
      });

      await expect(TodoService.delete("1")).resolves.not.toThrow();
      expect(mockSupabase.delete).toHaveBeenCalled();
    });

    it("should throw an error when deletion fails", async () => {
      mockSupabase.delete.mockResolvedValueOnce({
        error: new Error("Database error"),
      });

      await expect(TodoService.delete("1")).rejects.toThrow(AppError);
    });
  });

  describe("findById", () => {
    it("should find a todo by id successfully", async () => {
      mockSupabase.select.mockResolvedValueOnce({
        data: mockTodo,
        error: null,
      });

      const result = await TodoService.findById("1");
      expect(result).toEqual(mockTodo);
    });

    it("should throw not found error when todo does not exist", async () => {
      mockSupabase.select.mockResolvedValueOnce({
        data: null,
        error: null,
      });

      await expect(TodoService.findById("1")).rejects.toThrow(AppError);
    });
  });

  describe("findByUserId", () => {
    it("should find todos by user id successfully", async () => {
      mockSupabase.select.mockResolvedValueOnce({
        data: [mockTodo],
        error: null,
      });

      const result = await TodoService.findByUserId("user1");
      expect(result).toEqual([mockTodo]);
      expect(mockSupabase.order).toHaveBeenCalledWith("created_at", {
        ascending: false,
      });
    });

    it("should return empty array when no todos found", async () => {
      mockSupabase.select.mockResolvedValueOnce({
        data: [],
        error: null,
      });

      const result = await TodoService.findByUserId("user1");
      expect(result).toEqual([]);
    });
  });

  describe("findWithUser", () => {
    it("should find todos with user data successfully", async () => {
      const todoWithUser = {
        ...mockTodo,
        user: {
          email: "test@example.com",
          full_name: "Test User",
        },
      };

      mockSupabase.select.mockResolvedValueOnce({
        data: [todoWithUser],
        error: null,
      });

      const result = await TodoService.findWithUser();
      expect(result).toEqual([todoWithUser]);
    });

    it("should apply custom query when provided", async () => {
      const customQuery = (builder: any) => builder.eq("completed", true);
      mockSupabase.select.mockResolvedValueOnce({
        data: [mockTodo],
        error: null,
      });

      await TodoService.findWithUser(customQuery);
      expect(mockSupabase.eq).toHaveBeenCalledWith("completed", true);
    });
  });
});
