import type { Request, Response } from 'express';

import { TodoModel } from '../models/todoModel.js';

import type {
    CreateTodoRequest,
    UpdateTodoRequest,
    TodoRow,
    TodoResponse
} from '../../types/todo.js';

import {
    sendSuccess,
    sendSuccessPagination,
    sendError
} from '../utils/response';


// Mengubah data dari database
// is_completed -> completed
const transformTodo = (todo: TodoRow): TodoResponse => ({
    id: todo.id,
    task: todo.task,
    completed: Boolean(todo.is_completed)
});


// Mengambil parameter pagination
const getPagination = (req: Request) => {
    const page = Math.max(
        Number(req.query.page) || 1,
        1
    );

    const limit = Math.max(
        Number(req.query.limit) || 10,
        1
    );

    return {
        page,
        limit
    };
};


// ==========================================
// GET SEMUA TODO
// GET /api/todos?page=1&limit=10
// ==========================================
export const getTodos = async (
    req: Request,
    res: Response
): Promise<void> => {

    const userId = res.locals.userId;

    const { page, limit } = getPagination(req);

    try {

        const todos = await TodoModel.getByUserId(
            userId,
            page,
            limit
        );

        const total = await TodoModel.countByUserId(
            userId
        );

        const totalPages = Math.ceil(
            total / limit
        );

        const data: TodoResponse[] = (
            todos as TodoRow[]
        ).map(transformTodo);

        sendSuccessPagination(
            res,
            'Data tugas berhasil diambil.',
            data,
            {
                page,
                limit,
                total,
                totalPages
            }
        );

    } catch (error) {

        console.error(
            'ERROR GET TODOS:',
            error
        );

        sendError(
            res,
            'Gagal mengambil data.',
            500
        );
    }
};


// ==========================================
// GET TODO BERDASARKAN ID
// GET /api/todos/:id
// ==========================================
export const getTodoById = async (
    req: Request,
    res: Response
): Promise<void> => {

    const id = Number(req.params.id);

    const userId = res.locals.userId;

    try {

        const todo = await TodoModel.getById(
            id,
            userId
        );

        if (!todo) {

            sendError(
                res,
                'Tugas tidak ditemukan.',
                404
            );

            return;
        }

        const data = transformTodo(
            todo as TodoRow
        );

        sendSuccess(
            res,
            'Data tugas berhasil diambil.',
            data
        );

    } catch (error) {

        console.error(
            'ERROR GET TODO BY ID:',
            error
        );

        sendError(
            res,
            'Gagal mengambil data tugas.',
            500
        );
    }
};


// ==========================================
// CREATE TODO
// POST /api/todos
// ==========================================
export const createTodo = async (
    req: Request,
    res: Response
): Promise<void> => {

    const payload: CreateTodoRequest = req.body;

    const userId = res.locals.userId;

    try {

        const newId = await TodoModel.create(
            userId,
            payload.task
        );

        const data: TodoResponse = {
            id: newId,
            task: payload.task,
            completed: false
        };

        sendSuccess(
            res,
            'Tugas berhasil ditambahkan!',
            data,
            201
        );

    } catch (error) {

        // Menampilkan error asli di terminal
        console.error(
            'ERROR CREATE TODO:',
            error
        );

        sendError(
            res,
            'Gagal menambahkan tugas.',
            500
        );
    }
};


// ==========================================
// UPDATE TODO
// PUT /api/todos/:id
// ==========================================
export const updateTodo = async (
    req: Request,
    res: Response
): Promise<void> => {

    const id = Number(req.params.id);

    const payload: UpdateTodoRequest = req.body;

    const userId = res.locals.userId;

    try {

        const result = await TodoModel.update(
            id,
            userId,
            payload.task,
            payload.is_completed
        );

        if (result.affectedRows === 0) {

            sendError(
                res,
                'Tugas tidak ditemukan.',
                404
            );

            return;
        }

        const data: TodoResponse = {
            id,
            task: payload.task,
            completed: payload.is_completed
        };

        sendSuccess(
            res,
            'Tugas berhasil diperbarui!',
            data
        );

    } catch (error) {

        console.error(
            'ERROR UPDATE TODO:',
            error
        );

        sendError(
            res,
            'Gagal memperbarui tugas.',
            500
        );
    }
};


// ==========================================
// DELETE TODO
// DELETE /api/todos/:id
// ==========================================
export const deleteTodo = async (
    req: Request,
    res: Response
): Promise<void> => {

    const id = Number(req.params.id);

    const userId = res.locals.userId;

    try {

        const result = await TodoModel.delete(
            id,
            userId
        );

        if (result.affectedRows === 0) {

            sendError(
                res,
                'Tugas tidak ditemukan.',
                404
            );

            return;
        }

        sendSuccess(
            res,
            'Tugas berhasil dihapus!'
        );

    } catch (error) {

        console.error(
            'ERROR DELETE TODO:',
            error
        );

        sendError(
            res,
            'Gagal menghapus tugas.',
            500
        );
    }
};