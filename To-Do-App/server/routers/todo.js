// external modules
const express = require('express');
const router = express.Router();

// local modules
const todoController = require('../controllers/todo');

router.get('/', todoController.getTodos);
router.post('/', todoController.postTodo);
router.delete('/:id', todoController.deleteTodo);
router.put('/:id/completed', todoController.toggleCompleted);
router.put('/:id', todoController.updateTodo);

module.exports = {
	todoRouter: router,
};
