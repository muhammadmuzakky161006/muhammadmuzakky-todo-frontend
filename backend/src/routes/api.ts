import { Router } from 'express';
import { register, login } from '../controllers/authControllers.js';
import { getTodos, createTodo } from '../controllers/todoControllers.js';
import { validateRegister, validateLogin, validateTodo } from '../middleware/validator.js';
import jwt from 'jsonwebtoken';
import type { Request, Response, NextFunction } from 'express';

const verifyToken = (req: Request, res: Response, next: NextFunction) => {
	const authorization = req.headers.authorization;
	const token = authorization?.startsWith('Bearer ')
		? authorization.slice(7)
		: undefined;

	if (!token) {
		return res.status(401).json({ message: 'Access token is required' });
	}

	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { id: number };
		res.locals.userId = decoded.id;
		next();
	} catch {
		return res.status(401).json({ message: 'Invalid or expired token' });
	}
};

const router = Router();

// AUTHENTICATION ROUTES
router.post('/auth/register', validateRegister, register);
router.post('/auth/login', validateLogin, login);

// TODO ROUTES (Protected)
router.get('/todos', verifyToken, getTodos);
router.post('/todos', verifyToken, validateTodo, createTodo);

export default router;