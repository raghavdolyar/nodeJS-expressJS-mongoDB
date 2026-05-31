import { createAsyncThunk } from '@reduxjs/toolkit';
import {
	addTodoToServer,
	deleteTodoOnServer,
	getTodosFromServer,
	toggleTodoCompleteOnServer,
	updateTodoOnServer,
} from '../services/todoService';

export const getTodos = createAsyncThunk('todo/getTodos', async () => {
	const todos = await getTodosFromServer();
	return todos;
});

export const addTodo = createAsyncThunk('todo/addTodo', async text => {
	const addedTodo = await addTodoToServer(text);
	return addedTodo;
});

export const deleteTodo = createAsyncThunk('todo/deleteTodo', async id => {
	const deletedId = await deleteTodoOnServer(id);
	return deletedId;
});

export const updateTodo = createAsyncThunk(
	'todo/updateTodo',
	async ({ id, text }) => {
		const updatedTodo = await updateTodoOnServer(id, text);
		return updatedTodo;
	},
);

export const toggleCompleteTodo = createAsyncThunk(
	'todo/toggleCompleteTodo',
	async id => {
		const toggledTodo = await toggleTodoCompleteOnServer(id);
		return toggledTodo;
	},
);
