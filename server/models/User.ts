import pool from '../config/database';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

export interface User {
  id: number;
  email: string;
  password: string;
  companyName: string;
  kvkNumber: string;
  vatNumber: string;
  role: 'user' | 'admin';
  sessionToken?: string;
}

class UserModel {
  static async findByEmail(email: string): Promise<User | null> {
    const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    return rows[0] as User || null;
  }

  static async create(user: Omit<User, 'id'>): Promise<User> {
    const hashedPassword = await bcrypt.hash(user.password, 12);
    const [result] = await pool.query(
      'INSERT INTO users (email, password, companyName, kvkNumber, vatNumber, role) VALUES (?, ?, ?, ?, ?, ?)',
      [user.email, hashedPassword, user.companyName, user.kvkNumber, user.vatNumber, user.role]
    );
    return { ...user, id: result.insertId } as User;
  }

  static async findById(id: number): Promise<User | null> {
    const [rows] = await pool.query('SELECT * FROM users WHERE id = ?', [id]);
    return rows[0] as User || null;
  }

  static async updateSessionToken(id: number, sessionToken: string): Promise<void> {
    await pool.query('UPDATE users SET sessionToken = ? WHERE id = ?', [sessionToken, id]);
  }

  static async comparePassword(user: User, candidatePassword: string): Promise<boolean> {
    return bcrypt.compare(candidatePassword, user.password);
  }

  static generateSessionToken(): string {
    return crypto.randomBytes(32).toString('hex');
  }
}

export default UserModel;