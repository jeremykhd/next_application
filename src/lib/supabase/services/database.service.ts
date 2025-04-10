import { supabase } from "../config";

export class DatabaseService {
  static async query<T>(
    table: string,
    query: (builder: any) => any
  ): Promise<T[]> {
    const { data, error } = await query(supabase.from(table));
    if (error) throw error;
    return data;
  }

  static async insert<T>(table: string, data: Partial<T>) {
    const { data: result, error } = await supabase
      .from(table)
      .insert(data)
      .select()
      .single();
    if (error) throw error;
    return result as T;
  }

  static async update<T>(table: string, id: string | number, data: Partial<T>) {
    const { data: result, error } = await supabase
      .from(table)
      .update(data)
      .eq("id", id)
      .select()
      .single();
    if (error) throw error;
    return result as T;
  }

  static async delete(table: string, id: string | number) {
    const { error } = await supabase.from(table).delete().eq("id", id);
    if (error) throw error;
  }

  static async getById<T>(table: string, id: string | number): Promise<T> {
    const { data, error } = await supabase
      .from(table)
      .select()
      .eq("id", id)
      .single();
    if (error) throw error;
    return data;
  }
}
