const PORT = 3000;
const BACKEND_URL = `http://localhost:${PORT}`;

const mapTodo = serverTodo => {
	return {
		id: serverTodo._id,
		text: serverTodo.text,
		completed: serverTodo.completed,
	};
};

const checkError = async res => {
	if (!res.ok) {
		let msg = 'an error occurred';
		try {
			const data = await res.json();
			msg = data.message || msg;
		} catch {
			// ignore JSON parse error
		}
		throw new Error(`${res.status}: ${msg}`);
	}
};

export const addTodoToServer = async text => {
	const res = await fetch(BACKEND_URL + `/todos`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({ text }),
	});

	await checkError(res);
	const todo = await res.json();
	return mapTodo(todo);
};

export const getTodosFromServer = async () => {
	const res = await fetch(BACKEND_URL + `/todos`);
	await checkError(res);
	const todos = await res.json();
	return todos.map(mapTodo);
};

export const deleteTodoOnServer = async id => {
	const res = await fetch(BACKEND_URL + `/todos/${id}`, {
		method: 'DELETE',
	});

	await checkError(res);
	const { _id } = await res.json();
	return _id;
};

export const updateTodoOnServer = async (id, text) => {
	const res = await fetch(BACKEND_URL + `/todos/${id}`, {
		method: 'PUT',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({ text }),
	});

	await checkError(res);
	const todo = await res.json();
	return mapTodo(todo);
};

export const toggleTodoCompleteOnServer = async id => {
	const res = await fetch(BACKEND_URL + `/todos/${id}/completed`, {
		method: 'PUT',
	});

	await checkError(res);
	const todo = await res.json();
	return mapTodo(todo);
};
