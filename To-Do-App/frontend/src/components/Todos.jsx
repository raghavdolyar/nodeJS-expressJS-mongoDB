import { useSelector } from 'react-redux';
import Todo from './Todo';

export default function Todos() {
	const todos = useSelector(state => state.todos);

	return (
		<>
			<div className='text-[#6688aa] font-bold text-[13px] mb-2 border-b border-[#d8d8d8] pb-1'>
				→ Todos
			</div>
			<ul>
				{todos.map(todo => (
					<Todo key={todo.id} todo={todo} />
				))}
			</ul>
		</>
	);
}
