import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "./database.types";

export type Tables = Database["public"]["Tables"];
export type TableName = keyof Tables;

export type Row<T extends TableName> = Tables[T]["Row"];
export type InsertDto<T extends TableName> = Tables[T]["Insert"];
export type UpdateDto<T extends TableName> = Tables[T]["Update"];

export type PostgrestFilterBuilder<T> = ReturnType<
  SupabaseClient<Database>["from"]
>["select"] extends (args: any) => infer R
  ? R
  : never;

export type QueryBuilder<T> = (
  builder: PostgrestFilterBuilder<T>
) => PostgrestFilterBuilder<T>;
