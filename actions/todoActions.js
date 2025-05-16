'use server';

const API_URL = "https://todo-backend-j6gr.onrender.com/api/todos"

// Fetch all todos
export async function fetchTodosAction() {
  const res = await fetch(API_URL);
  if (!res.ok) throw new Error('Failed to fetch todos');
  return res.json();
}

// Add new todo
export async function addTodoAction(title) {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title }),
  });
  if (!res.ok) throw new Error('Failed to add todo');
  return res.json();
}

// Toggle complete status
export async function toggleTodoAction(id, completed) {
  const res = await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ completed: !completed }),
  });
  if (!res.ok) throw new Error('Failed to update todo');
  return res.json();
}

// Delete todo
export async function deleteTodoAction(id) {
  const res = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Failed to delete todo');
  return true;
}
