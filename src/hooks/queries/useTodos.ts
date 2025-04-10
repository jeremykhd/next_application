import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { TodoService } from "@/lib/supabase/services/todo.service";
import { CreateTodoDto, Todo, UpdateTodoDto } from "@/types/todo";
import { AppError } from "@/lib/errors/AppError";

export function useTodos(userId: string) {
  const queryClient = useQueryClient();
  const queryKey = ["todos", userId];

  const query = useQuery<Todo[], AppError>({
    queryKey,
    queryFn: () => TodoService.findByUserId(userId),
  });

  const createMutation = useMutation({
    mutationFn: (dto: CreateTodoDto) => TodoService.create(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: UpdateTodoDto }) =>
      TodoService.update(id, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: TodoService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });

  return {
    todos: query.data || [],
    isLoading: query.isLoading,
    error: query.error,
    create: createMutation.mutate,
    update: updateMutation.mutate,
    delete: deleteMutation.mutate,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
}
