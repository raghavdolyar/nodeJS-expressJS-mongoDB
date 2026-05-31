import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addTodo } from '../features/todoThunks';

export default function AddTodo() {
	const [task, setTask] = useState('');
	const dispatch = useDispatch();

	const addHandler = evt => {
		evt.preventDefault();
		if (task.trim()) {
			dispatch(addTodo(task.trim()));
		}
		setTask('');
	};

	return (
		<form onSubmit={addHandler} className='flex gap-2 mb-4'>
			<input
				type='text'
				placeholder='Enter a Todo'
				value={task}
				onChange={evt => setTask(evt.target.value)}
				className='flex-1 border border-[#c0c0c0] px-2 py-1.5 text-[13px] text-[#333] outline-none focus:border-[#7fb3d3]'
			/>
			<button
				type='submit'
				className='px-4 py-1.5 text-[13px] text-white bg-[#7fb3d3] hover:bg-[#6aa0c0] border border-[#5f90b0] cursor-pointer font-bold'>
				Add
			</button>
		</form>
	);
}
