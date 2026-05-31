import { createSlice, nanoid } from '@reduxjs/toolkit';

const initialState = {
	todos: JSON.parse(localStorage.getItem('todos')) ?? [],
};

export const todoSlice = createSlice({
	name: 'todo',
	initialState,
	reducers: {
		addTodo: (state, action) => {
			state.todos.push({
				id: nanoid(),
				text: action.payload,
				completed: false,
			});
		},
		deleteTodo: (state, action) => {
			state.todos = state.todos.filter(todo => todo.id !== action.payload);
		},
		updateTodo: (state, action) => {
			state.todos.forEach(todo => {
				if (todo.id === action.payload.id) {
					todo.text = action.payload.text;
				}
			});
		},
		toggleComplete: (state, action) => {
			const todo = state.todos.find(todo => todo.id === action.payload);
			if (todo) {
				todo.completed = !todo.completed;
			}
		},
	},
});

export const { addTodo, deleteTodo, updateTodo, toggleComplete } = todoSlice.actions;
export default todoSlice.reducer;
