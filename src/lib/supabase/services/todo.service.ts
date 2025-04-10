import { PostgrestFilterBuilder } from "@/types/supabase";
import { CreateTodoDto, Todo, TodoWithUser, UpdateTodoDto } from "@/types/todo";
import { AppError } from "@/lib/errors/AppError";
import { supabase } from "../config";

export class TodoService {
  private static readonly table = "todos";

  static async create(dto: CreateTodoDto): Promise<Todo> {
    try {
      const { data, error } = await supabase
        .from(this.table)
        .insert({ ...dto, completed: false })
        .select()
        .single();

      if (error) throw error;
      if (!data) throw AppError.internal("Failed to create todo");

      return data;
    } catch (error) {
      if (error instanceof Error) {
        throw AppError.badRequest(error.message);
      }
      throw AppError.internal("Failed to create todo");
    }
  }

  static async update(id: string, dto: UpdateTodoDto): Promise<Todo> {
    try {
      const { data, error } = await supabase
        .from(this.table)
        .update(dto)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      if (!data) throw AppError.notFound("Todo not found");

      return data;
    } catch (error) {
      if (error instanceof Error) {
        throw AppError.badRequest(error.message);
      }
      throw AppError.internal("Failed to update todo");
    }
  }

  static async delete(id: string): Promise<void> {
    try {
      const { error } = await supabase.from(this.table).delete().eq("id", id);

      if (error) throw error;
    } catch (error) {
      if (error instanceof Error) {
        throw AppError.badRequest(error.message);
      }
      throw AppError.internal("Failed to delete todo");
    }
  }

  static async findById(id: string): Promise<Todo> {
    try {
      const { data, error } = await supabase
        .from(this.table)
        .select()
        .eq("id", id)
        .single();

      if (error) throw error;
      if (!data) throw AppError.notFound("Todo not found");

      return data;
    } catch (error) {
      if (error instanceof Error) {
        throw AppError.badRequest(error.message);
      }
      throw AppError.internal("Failed to fetch todo");
    }
  }

  static async findByUserId(userId: string): Promise<Todo[]> {
    try {
      const { data, error } = await supabase
        .from(this.table)
        .select()
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      if (error instanceof Error) {
        throw AppError.badRequest(error.message);
      }
      throw AppError.internal("Failed to fetch todos");
    }
  }

  static async findWithUser(
    query?: (
      builder: PostgrestFilterBuilder<TodoWithUser>
    ) => PostgrestFilterBuilder<TodoWithUser>
  ): Promise<TodoWithUser[]> {
    try {
      let builder = supabase.from(this.table).select(`
          *,
          user:user_id (
            email,
            full_name
          )
        `);

      if (query) {
        builder = query(builder as any);
      }

      const { data, error } = await builder;

      if (error) throw error;
      return (data as TodoWithUser[]) || [];
    } catch (error) {
      if (error instanceof Error) {
        throw AppError.badRequest(error.message);
      }
      throw AppError.internal("Failed to fetch todos with users");
    }
  }
}
