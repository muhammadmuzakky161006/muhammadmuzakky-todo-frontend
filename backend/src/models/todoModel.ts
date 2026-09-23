import pool from '../config/db.js';

export const TodoModel = {
  getByUserId: async (userId: number) => {
    const [rows]: any = await pool.query(
      'SELECT id, task, is_completed FROM todos WHERE user_id = ? ORDER BY id DESC',
      [userId]
    );

    return rows;
  },

  getById: async (id: number, userId: number) => {
    const [rows]: any = await pool.query(
      'SELECT id, task, is_completed FROM todos WHERE id = ? AND user_id = ?',
      [id, userId]
    );

    return rows[0];
  },

  create: async (userId: number, task: string) => {
    const [result]: any = await pool.query(
      'INSERT INTO todos (user_id, task, is_completed) VALUES (?, ?, ?)',
      [userId, task, false]
    );

    return result.insertId;
  },

  update: async (
    id: number,
    userId: number,
    task: string,
    is_completed: boolean
  ) => {
    const [result]: any = await pool.query(
      'UPDATE todos SET task = ?, is_completed = ? WHERE id = ? AND user_id = ?',
      [task, is_completed, id, userId]
    );

    return result;
  },

  delete: async (id: number, userId: number) => {
    const [result]: any = await pool.query(
      'DELETE FROM todos WHERE id = ? AND user_id = ?',
      [id, userId]
    );

    return result;
  },
};