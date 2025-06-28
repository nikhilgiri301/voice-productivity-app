import { createClient } from '@supabase/supabase-js';
import { ProductivityItem, UserPreferences, DatabaseResponse } from '../types';

// Supabase configuration
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database utility functions
export class DatabaseService {
  // Productivity Items CRUD operations
  static async createItem(item: Omit<ProductivityItem, 'id' | 'created_at' | 'updated_at'>): Promise<DatabaseResponse<ProductivityItem>> {
    try {
      const { data, error } = await supabase
        .from('productivity_items')
        .insert([item])
        .select()
        .single();

      return { data, error: error?.message || null };
    } catch (err) {
      return { data: null, error: (err as Error).message };
    }
  }

  static async getItems(userId: string): Promise<DatabaseResponse<ProductivityItem[]>> {
    try {
      const { data, error } = await supabase
        .from('productivity_items')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      return { data: data || [], error: error?.message || null };
    } catch (err) {
      return { data: null, error: (err as Error).message };
    }
  }

  static async getItemById(id: string): Promise<DatabaseResponse<ProductivityItem>> {
    try {
      const { data, error } = await supabase
        .from('productivity_items')
        .select('*')
        .eq('id', id)
        .single();

      return { data, error: error?.message || null };
    } catch (err) {
      return { data: null, error: (err as Error).message };
    }
  }

  static async updateItem(id: string, updates: Partial<ProductivityItem>): Promise<DatabaseResponse<ProductivityItem>> {
    try {
      const { data, error } = await supabase
        .from('productivity_items')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

      return { data, error: error?.message || null };
    } catch (err) {
      return { data: null, error: (err as Error).message };
    }
  }

  static async deleteItem(id: string): Promise<DatabaseResponse<boolean>> {
    try {
      const { error } = await supabase
        .from('productivity_items')
        .delete()
        .eq('id', id);

      return { data: !error, error: error?.message || null };
    } catch (err) {
      return { data: false, error: (err as Error).message };
    }
  }

  // Get items by type
  static async getItemsByType(userId: string, type: ProductivityItem['type']): Promise<DatabaseResponse<ProductivityItem[]>> {
    try {
      const { data, error } = await supabase
        .from('productivity_items')
        .select('*')
        .eq('user_id', userId)
        .eq('type', type)
        .order('created_at', { ascending: false });

      return { data: data || [], error: error?.message || null };
    } catch (err) {
      return { data: null, error: (err as Error).message };
    }
  }

  // Get today's items (calendar events and tasks due today)
  static async getTodaysItems(userId: string): Promise<DatabaseResponse<ProductivityItem[]>> {
    try {
      const today = new Date().toISOString().split('T')[0];
      const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0];

      const { data, error } = await supabase
        .from('productivity_items')
        .select('*')
        .eq('user_id', userId)
        .or(`and(type.eq.calendar,start_time.gte.${today},start_time.lt.${tomorrow}),and(type.eq.task,due_date.gte.${today},due_date.lt.${tomorrow})`)
        .order('start_time', { ascending: true });

      return { data: data || [], error: error?.message || null };
    } catch (err) {
      return { data: null, error: (err as Error).message };
    }
  }

  // User Preferences
  static async getUserPreferences(userId: string): Promise<DatabaseResponse<UserPreferences>> {
    try {
      const { data, error } = await supabase
        .from('user_preferences')
        .select('*')
        .eq('user_id', userId)
        .single();

      return { data, error: error?.message || null };
    } catch (err) {
      return { data: null, error: (err as Error).message };
    }
  }

  static async updateUserPreferences(userId: string, preferences: Partial<UserPreferences>): Promise<DatabaseResponse<UserPreferences>> {
    try {
      const { data, error } = await supabase
        .from('user_preferences')
        .upsert({ 
          user_id: userId, 
          ...preferences, 
          updated_at: new Date().toISOString() 
        })
        .select()
        .single();

      return { data, error: error?.message || null };
    } catch (err) {
      return { data: null, error: (err as Error).message };
    }
  }

  // Real-time subscriptions
  static subscribeToItems(userId: string, callback: (payload: any) => void) {
    return supabase
      .channel('productivity_items')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'productivity_items',
          filter: `user_id=eq.${userId}`,
        },
        callback
      )
      .subscribe();
  }

  // Authentication helpers
  static async getCurrentUser() {
    const { data: { user }, error } = await supabase.auth.getUser();
    return { user, error };
  }

  static async signIn(email: string, password: string) {
    return await supabase.auth.signInWithPassword({ email, password });
  }

  static async signUp(email: string, password: string) {
    return await supabase.auth.signUp({ email, password });
  }

  static async signOut() {
    return await supabase.auth.signOut();
  }
}
