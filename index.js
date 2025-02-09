import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';  // Этот импорт добавляем
import pkg from 'pg';
const { Pool } = pkg;
import jwt from 'jsonwebtoken';  // Этот импорт добавляем
import bcrypt from 'bcrypt';      // Этот импорт добавляем

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

app.use(cors());  // Добавляем использование CORS
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
  .catch(err => console.error('Error creating table:', err));

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
