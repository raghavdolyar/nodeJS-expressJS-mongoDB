const Todo = require('../models/todo');

exports.getTodos = async (req, res, next) => {
	try {
		const todos = await Todo.find();
		res.status(200).json(todos);
	} catch (err) {
		next(err);
	}
};

exports.postTodo = async (req, res, next) => {
	try {
		const { text } = req.body;
		const todo = new Todo({ text });
		const item = await todo.save();
		res.status(201).json(item);
	} catch (err) {
		next(err);
	}
};

exports.deleteTodo = async (req, res, next) => {
	try {
		const { id } = req.params;
		await Todo.findByIdAndDelete(id);
		res.status(200).json({ _id: id });
	} catch (err) {
		next(err);
	}
};

exports.updateTodo = async (req, res, next) => {
	try {
		const { id } = req.params;
		const { text } = req.body;
		const updatedTodo = await Todo.findByIdAndUpdate(
			id,
			{ text },
			{ returnDocument: 'after' },
		);
		res.status(200).json(updatedTodo);
	} catch (err) {
		next(err);
	}
};

exports.toggleCompleted = async (req, res, next) => {
	try {
		const { id } = req.params;
		const todo = await Todo.findById(id);

		if (!todo) {
			return res.status(404).json({ message: 'Todo not found' });
		}

		todo.completed = !todo.completed;
		const updatedTodo = await todo.save();
		res.status(200).json(updatedTodo);
	} catch (err) {
		next(err);
	}
};
