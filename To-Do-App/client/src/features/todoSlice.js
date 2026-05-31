import { createSlice } from '@reduxjs/toolkit';
import {
	getTodos,
	addTodo,
	deleteTodo,
	updateTodo,
	toggleCompleteTodo,
} from './todoThunks';

const initialState = {
	todos: [],
	loading: true,
	error: null,
};

export const todoSlice = createSlice({
	name: 'todo',
	initialState,
	extraReducers: builder => {
		// GET TODOS
		builder.addCase(getTodos.pending, state => {
			state.loading = true;
			state.error = null;
		});
		builder.addCase(getTodos.fulfilled, (state, action) => {
			state.todos = action.payload;
			state.loading = false;
		});
		builder.addCase(getTodos.rejected, (state, action) => {
			state.loading = false;
			state.error = action.error.message;
		});

		// ADD TODO
		builder.addCase(addTodo.pending, (state, action) => {
			state.error = null;
			state.todos.push({
				id: 'temp-' + Date.now(),
				text: action.meta.arg,
				completed: false,
				isTemp: true,
			});
		});
		builder.addCase(addTodo.fulfilled, (state, action) => {
			// replace the temp todo with the real one
			const index = state.todos.findIndex(
				t => t.isTemp && t.text === action.meta.arg,
			);
			if (index !== -1) {
				state.todos[index] = action.payload;
			} else {
				state.todos.push(action.payload);
			}
		});
		builder.addCase(addTodo.rejected, (state, action) => {
			state.error = action.error.message;
			state.todos = state.todos.filter(
				t => !(t.isTemp && t.text === action.meta.arg),
			);
		});

		// DELETE TODO
		builder.addCase(deleteTodo.pending, (state, action) => {
			state.error = null;
			const todo = state.todos.find(t => t.id === action.meta.arg);
			if (todo) {
				todo.hidden = true;
			}
		});
		builder.addCase(deleteTodo.fulfilled, (state, action) => {
			state.todos = state.todos.filter(todo => todo.id !== action.payload);
		});
		builder.addCase(deleteTodo.rejected, (state, action) => {
			state.error = action.error.message;
			const todo = state.todos.find(t => t.id === action.meta.arg);
			if (todo) {
				todo.hidden = false;
			}
		});

		// UPDATE TODO
		builder.addCase(updateTodo.pending, (state, action) => {
			state.error = null;
			const todo = state.todos.find(t => t.id === action.meta.arg.id);
			if (todo) {
				todo.previousText = todo.text;
				todo.text = action.meta.arg.text;
			}
		});
		// No fulfilled state modification needed for update, avoids re-render
		builder.addCase(updateTodo.rejected, (state, action) => {
			state.error = action.error.message;
			const todo = state.todos.find(t => t.id === action.meta.arg.id);
			if (todo && todo.previousText !== undefined) {
				todo.text = todo.previousText;
			}
		});
		
		// TOGGLE COMPLETE
		builder.addCase(toggleCompleteTodo.pending, (state, action) => {
			state.error = null;
			const todo = state.todos.find(t => t.id === action.meta.arg);
			if (todo) {
				todo.completed = !todo.completed;
			}
		});
		// No fulfilled state modification needed for toggle, avoids re-render
		builder.addCase(toggleCompleteTodo.rejected, (state, action) => {
			state.error = action.error.message;
			const todo = state.todos.find(t => t.id === action.meta.arg);
			if (todo) {
				todo.completed = !todo.completed; // rollback
			}
		});
	},
});

export default todoSlice.reducer;
