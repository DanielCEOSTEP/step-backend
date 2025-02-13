import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import pkg from 'pg';
const { Pool } = pkg;
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
const pool = new Pool({
  connectionString: 'postgresql://postgres:dJXdRcmlKqYgJQUyoyATYEYgmbofLXkn@roundhouse.proxy.rlwy.net:29715/railway',
  ssl: { rejectUnauthorized: false },
});

app.use(cors());
app.use(express.json());

// Создаем таблицу pending_chats, если её нет
pool.query(`
  CREATE TABLE IF NOT EXISTS pending_chats (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    target_user_id INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (user_id, target_user_id)
  );
`).then(() => console.log('Table "pending_chats" is ready'))
  .catch(err => console.error('Error creating pending_chats table:', err));

// Запуск сервера
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
