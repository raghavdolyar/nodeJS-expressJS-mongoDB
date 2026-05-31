import React, { useCallback, useState } from 'react';
import { useDispatch } from 'react-redux';
import {
	deleteTodo,
	updateTodo,
	toggleComplete,
} from '../features/todo/todoSlice';

const Todo = React.memo(({ todo }) => {
	const dispatch = useDispatch();

	const [isEditing, setIsEditing] = useState(false);
	const [editText, setEditText] = useState(todo.text);

	const startEdit = useCallback(() => {
		setIsEditing(true);
		setEditText(todo.text);
	}, [todo.text]);

	const saveEdit = useCallback(() => {
		if (editText.trim() === todo.text) {
			setIsEditing(false);
		} else if (editText.trim()) {
			dispatch(updateTodo({ id: todo.id, text: editText.trim() }));
		} else {
			dispatch(deleteTodo(todo.id));
		}
		setIsEditing(false);
	}, [dispatch, editText, todo]);

	const handleDelete = useCallback(() => {
		dispatch(deleteTodo(todo.id));
	}, [dispatch, todo.id]);

	const handleKeyDown = useCallback(
		evt => {
			if (evt.key === 'Enter') saveEdit();
			if (evt.key === 'Escape') setIsEditing(false);
		},
		[saveEdit],
	);

	return (
		<li className='flex items-center gap-3 py-1.5 border-b border-[#ebebeb] text-[13px] hover:bg-[#f8f8f8] transition-colors'>
			{isEditing ? (
				<>
					<input
						value={editText}
						onChange={evt => setEditText(evt.target.value)}
						onKeyDown={handleKeyDown}
						className='flex-1 border border-[#c0c0c0] px-2 py-1 text-[13px] text-[#333] outline-none focus:border-[#7fb3d3]'
					/>
					<button
						onClick={saveEdit}
						className='px-3 py-1 text-[12px] text-white bg-[#5faa5f] hover:bg-[#4e9a4e] border border-[#3d8c3d] cursor-pointer font-bold'>
						Save
					</button>
				</>
			) : (
				<>
					<input
						type='checkbox'
						checked={todo.completed || false}
						onChange={() => dispatch(toggleComplete(todo.id))}
						className='cursor-pointer w-3.5 h-3.5'
					/>
					<span
						className={`flex-1 ${todo.completed ? 'line-through text-[#999]' : 'text-[#333]'}`}>
						{todo.text}
					</span>
					{!todo.completed && (
						<button
							onClick={startEdit}
							className='text-[#3377aa] hover:underline text-[12px] cursor-pointer bg-transparent border-none font-bold'>
							Edit
						</button>
					)}
					<button
						onClick={handleDelete}
						className='text-[#c03030] hover:underline text-[12px] cursor-pointer bg-transparent border-none font-bold'>
						Delete
					</button>
				</>
			)}
		</li>
	);
});

export default Todo;
