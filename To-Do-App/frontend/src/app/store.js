import { configureStore } from '@reduxjs/toolkit';
import todoReducer from '../features/todo/todoSlice';

export const store = configureStore({
	reducer: todoReducer,
});

// debounce: only write to localStorage 300ms after the last action
let debounceTimer;

store.subscribe(() => {
	clearTimeout(debounceTimer);
	debounceTimer = setTimeout(() => {
		localStorage.setItem('todos', JSON.stringify(store.getState().todos));
	}, 300);
});
