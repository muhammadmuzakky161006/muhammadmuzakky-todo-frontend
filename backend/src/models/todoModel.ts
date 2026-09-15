import pool from '../config/db.js';

export const TodoModel = {
  getByUserId: async (userId: number) => {
    const [rows]: any = await pool.query(
      'SELECT id, task, is_completed FROM todos WHERE user_id = ? ORDER BY id DESC',
      [userId]
    );
    return rows;
  },

  create: async (userId: number, task: string) => {
    const [result]: any = await pool.query(
      'INSERT INTO todos (user_id, task, is_completed) VALUES (?, ?, ?)',
      [userId, task, false]
    );
    return result.insertId;
  }
};