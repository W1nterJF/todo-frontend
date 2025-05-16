'use client';

import React, { useState, useEffect } from 'react';
import { Plus, CheckCircle, Circle, Trash2, RefreshCw } from 'lucide-react';
import {
  fetchTodosAction,
  addTodoAction,
  toggleTodoAction,
  deleteTodoAction
} from '../../actions/todoActions';

export default function TodoApp() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTodos = async () => {
    try {
      setLoading(true);
      const data = await fetchTodosAction();
      setTodos(data);
      setError(null);
    } catch (err) {
      setError('Failed to load todos. Please try again later.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const addTodo = async () => {
    if (!newTodo.trim()) return;
    try {
      const addedTodo = await addTodoAction(newTodo);
      setTodos([...todos, addedTodo]);
      setNewTodo('');
    } catch (err) {
      setError('Failed to add todo. Please try again.');
      console.error(err);
    }
  };

  const toggleTodo = async (id, completed) => {
    try {
      const updatedTodo = await toggleTodoAction(id, completed);
      setTodos(todos.map(todo => todo._id === id ? updatedTodo : todo));
    } catch (err) {
      setError('Failed to update todo. Please try again.');
      console.error(err);
    }
  };

  const deleteTodo = async (id) => {
    try {
      await deleteTodoAction(id);
      setTodos(todos.filter(todo => todo._id !== id));
    } catch (err) {
      setError('Failed to delete todo. Please try again.');
      console.error(err);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTodo();
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  return (
    <div className="min-h-screen bg-white text-white flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-gray-900 rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Todo App</h1>
          <button
            onClick={fetchTodos}
            className="p-2 rounded-full hover:bg-gray-800 transition-colors"
            aria-label="Refresh todos"
          >
            <RefreshCw size={20} />
          </button>
        </div>

        <div className="flex mb-6">
          <input
            type="text"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            onKeyPress={handleKeyPress}
            className="flex-grow p-3 bg-gray-800 border border-gray-700 rounded-l-md focus:outline-none focus:ring-1 focus:ring-white"
            placeholder="Add a new task..."
          />
          <button
            onClick={addTodo}
            className="bg-white text-black p-3 rounded-r-md hover:bg-gray-200 transition-colors flex items-center justify-center"
          >
            <Plus size={20} />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-900 text-white rounded-md">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex justify-center py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
          </div>
        ) : (
          <>
            {todos.length === 0 ? (
              <p className="text-center py-6 text-gray-400">No todos yet. Add one above!</p>
            ) : (
              <ul className="divide-y divide-gray-800">
                {todos.map((todo) => (
                  <li key={todo._id} className="py-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <button
                          onClick={() => toggleTodo(todo._id, todo.completed)}
                          className="mr-3 text-gray-400 hover:text-white transition-colors"
                        >
                          {todo.completed ? (
                            <CheckCircle size={20} className="text-white" />
                          ) : (
                            <Circle size={20} />
                          )}
                        </button>
                        <span className={`${todo.completed ? 'line-through text-gray-500' : 'text-white'}`}>
                          {todo.title}
                        </span>
                      </div>
                      <button
                        onClick={() => deleteTodo(todo._id)}
                        className="p-1 text-gray-500 hover:text-white rounded-full hover:bg-gray-800 transition-colors"
                        aria-label="Delete todo"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </>
        )}
      </div>
    </div>
  );
}
