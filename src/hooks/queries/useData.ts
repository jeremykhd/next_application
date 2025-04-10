import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { DatabaseService } from "@/lib/supabase/services/database.service";

export function useData<T>(table: string, queryFn?: (builder: any) => any) {
  const queryClient = useQueryClient();

  const query = useQuery<T[]>({
    queryKey: [table],
    queryFn: () =>
      DatabaseService.query<T>(table, queryFn || ((q) => q.select("*"))),
  });

  const createMutation = useMutation({
    mutationFn: (data: Partial<T>) => DatabaseService.insert<T>(table, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [table] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string | number; data: Partial<T> }) =>
      DatabaseService.update<T>(table, id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [table] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string | number) => DatabaseService.delete(table, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [table] });
    },
  });

  return {
    data: query.data,
    isLoading: query.isLoading,
    error: query.error,
    create: createMutation.mutate,
    update: updateMutation.mutate,
    delete: deleteMutation.mutate,
  };
}
