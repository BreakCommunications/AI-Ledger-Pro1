import pool from '../config/database';

export interface OpenAISettings {
  id: number;
  apiKey: string;
  model: string;
}

class OpenAISettingsModel {
  static async getSettings(): Promise<OpenAISettings | null> {
    const [rows] = await pool.query('SELECT * FROM openai_settings LIMIT 1');
    return rows[0] as OpenAISettings || null;
  }

  static async updateSettings(settings: Partial<OpenAISettings>): Promise<void> {
    const [existingSettings] = await pool.query('SELECT * FROM openai_settings LIMIT 1');
    if (existingSettings.length > 0) {
      await pool.query('UPDATE openai_settings SET apiKey = ?, model = ? WHERE id = ?', [
        settings.apiKey,
        settings.model,
        existingSettings[0].id
      ]);
    } else {
      await pool.query('INSERT INTO openai_settings (apiKey, model) VALUES (?, ?)', [
        settings.apiKey,
        settings.model
      ]);
    }
  }
}

export default OpenAISettingsModel;