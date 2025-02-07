
// Import required modules
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
const { Pool } = require('pg');
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

// Load environment variables
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
const jwtSecret = process.env.JWT_SECRET;

// Configure PostgreSQL connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

app.use(cors());
app.use(express.json());

// API Route: User Registration
app.post('/register', async (req, res) => {
  const { name, email, password, phone } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(
      'INSERT INTO users (name, email, password, phone) VALUES ($1, $2, $3, $4) RETURNING id',
      [name, email, hashedPassword, phone]
    );
    res.status(201).json({ message: 'User registered', userId: result.rows[0].id });
  } catch (error) {
    res.status(500).json({ error: 'Error registering user' });
  }
});

// API Route: User Login
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (result.rows.length === 0) return res.status(401).json({ error: 'Invalid credentials' });
    const user = result.rows[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: 'Invalid credentials' });
    const token = jwt.sign({ userId: user.id }, jwtSecret, { expiresIn: '1h' });
    res.json({ message: 'Login successful', token });
  } catch (error) {
    res.status(500).json({ error: 'Error logging in' });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
