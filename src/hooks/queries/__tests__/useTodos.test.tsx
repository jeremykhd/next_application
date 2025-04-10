import { renderHook, act } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useTodos } from '../useTodos';
import { TodoService } from '@/lib/supabase/services/todo.service';
import { AppError } from '@/lib/errors/AppError';

const mockTodo = {
  id: '1',
  title: 'Test Todo',
  completed: false,
  user_id: 'user1',
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
};

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

describe('useTodos', () => {
  beforeEach(() => {
    queryClient.clear();
    vi.clearAllMocks();
  });

  it('should fetch todos successfully', async () => {
    vi.spyOn(TodoService, 'findByUserId').mockResolvedValueOnce([mockTodo]);

    const { result } = renderHook(() => useTodos('user1'), { wrapper });

    expect(result.current.isLoading).toBe(true);
    expect(result.current.todos).toEqual([]);

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.todos).toEqual([mockTodo]);
  });

  it('should handle error when fetching todos', async () => {
    vi.spyOn(TodoService, 'findByUserId').mockRejectedValueOnce(
      new AppError('Failed to fetch todos', 'FETCH_ERROR')
    );

    const { result } = renderHook(() => useTodos('user1'), { wrapper });

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    expect(result.current.error).toBeInstanceOf(AppError);
    expect(result.current.error?.message).toBe('Failed to fetch todos');
  });

  it('should create a todo successfully', async () => {
    vi.spyOn(TodoService, 'findByUserId').mockResolvedValueOnce([]);
    vi.spyOn(TodoService, 'create').mockResolvedValueOnce(mockTodo);

    const { result } = renderHook(() => useTodos('user1'), { wrapper });

    await act(async () => {
      result.current.create({
        title: 'Test Todo',
        user_id: 'user1',
      });
    });

    expect(TodoService.create).toHaveBeenCalledWith({
      title: 'Test Todo',
      user_id: 'user1',
    });
  });

  it('should update a todo successfully', async () => {
    vi.spyOn(TodoService, 'findByUserId').mockResolvedValueOnce([mockTodo]);
    vi.spyOn(TodoService, 'update').mockResolvedValueOnce({
      ...mockTodo,
      title: 'Updated Todo',
    });

    const { result } = renderHook(() => useTodos('user1'), { wrapper });

    await act(async () => {
      result.current.update({
        id: '1',
        dto: { title: 'Updated Todo' },
      });
    });

    expect(TodoService.update).toHaveBeenCalledWith('1', {
      title: 'Updated Todo',
    });
  });

  it('should delete a todo successfully', async () => {
    vi.spyOn(TodoService, 'findByUserId').mockResolvedValueOnce([mockTodo]);
    vi.spyOn(TodoService, 'delete').mockResolvedValueOnce();

    const { result } = renderHook(() => useTodos('user1'), { wrapper });

    await act(async () => {
      result.current.delete('1');
    });

    expect(TodoService.delete).toHaveBeenCalledWith('1');
  });
}); 