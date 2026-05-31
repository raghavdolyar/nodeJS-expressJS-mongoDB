import { getTodos } from '../features/todoThunks';
import { useDispatch, useSelector } from 'react-redux';
import Todo from './Todo';
import { useEffect } from 'react';

export default function Todos() {
	const todos = useSelector(state => state.todos);
	const loading = useSelector(state => state.loading);
	const error = useSelector(state => state.error);
	const dispatch = useDispatch();

	useEffect(() => {
		dispatch(getTodos());
	}, [dispatch]);

	return (
		<>
			<div className='text-[#6688aa] font-bold text-[13px] mb-2 border-b border-[#d8d8d8] pb-1'>
				→ Todos
			</div>
			{error && (
				<div className='bg-[#f8d7da] text-[#c03030] border border-[#f5c6cb] px-4 py-3 mb-4 text-[13px] font-bold'>
					{error}
				</div>
			)}
			<ul>
				{loading ? (
					<div className='flex justify-center items-center py-6'>
						<svg
							className='animate-spin h-6 w-6 text-[#6688aa]'
							xmlns='http://www.w3.org/2000/svg'
							fill='none'
							viewBox='0 0 24 24'>
							<circle
								className='opacity-25'
								cx='12'
								cy='12'
								r='10'
								stroke='currentColor'
								strokeWidth='4'></circle>
							<path
								className='opacity-75'
								fill='currentColor'
								d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'></path>
						</svg>
					</div>
				) : (
					todos
						.filter(todo => !todo.hidden)
						.map(todo => <Todo key={todo.id} todo={todo} />)
				)}
			</ul>
		</>
	);
}
