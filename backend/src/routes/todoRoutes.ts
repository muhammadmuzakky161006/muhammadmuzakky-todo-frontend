import { Router } from 'express';

import {
  getTodos,
  getTodoById,
  createTodo,
  updateTodo,
  deleteTodo
} from '../controllers/todoControllers';

import { authenticateToken } from '../middleware/authMiddleware';

import {
  validateTodo,
  validateUpdateTodo
} from '../middleware/validator';

const router = Router();

// GET semua todo
router.get('/', authenticateToken, getTodos);

// GET todo berdasarkan ID
router.get('/:id', authenticateToken, getTodoById);

// POST membuat todo baru
router.post('/', authenticateToken, validateTodo, createTodo);

// PUT memperbarui todo
router.put('/:id', authenticateToken, validateUpdateTodo, updateTodo);

// DELETE menghapus todo
router.delete('/:id', authenticateToken, deleteTodo);

export default router;