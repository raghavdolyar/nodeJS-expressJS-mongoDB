import AddTodo from './components/AddTodo';
import Todos from './components/Todos';
import { Provider } from 'react-redux';
import { store } from './app/store';

function App() {
	return (
		<Provider store={store}>
			<div className='max-w-3xl mx-auto px-4 py-6'>
				<div className='text-[#6688aa] text-[20px] font-bold mb-4'>
					Todo List
				</div>
				<div className='bg-white border border-[#d8d8d8] p-5 shadow-sm'>
					<AddTodo />
					<Todos />
				</div>
			</div>
		</Provider>
	);
}

export default App;
