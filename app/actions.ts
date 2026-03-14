'use server';

import { supabase } from '@/lib/supabase';

interface Post {
  title: string;
  creator: string | null;
  post: string;
  created_at: string;
  html: boolean;
  slug: string;
}

export async function loginUser(username: string, password: string) {
  if (!username || !password) {
    return {
      success: false,
      message: 'Please enter both username and password.',
    };
  }

  try {
    const { data, error } = await supabase
      .from('admins')
      .select('id, name, password')
      .eq('name', username)
      .single();

    if (error) {
      console.error('Supabase query error:', error.message);
      return {
        success: false,
        message: 'Database error. Please try again later.',
      };
    }

    if (!data) {
      return {
        success: false,
        message: 'User with this username not found.',
      };
    }

    if (password !== data.password) {
      return { success: false, message: 'Invalid password.' };
    }

    console.log('Authorization successful:', data);

    return { success: true, message: 'Authorization successful!' };
  } catch (error: any) {
    console.error('An error occurred in Server Action:', error);
    return { success: false, message: 'An unexpected error occurred.' };
  }
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  try {
    const { data: result, error } = await supabase
      .from('posts')
      .select('*')
      .eq('slug', slug)
      .single();

    if (error || !result) {
      console.error('Supabase query error:', error?.message);
      return null;
    }

    console.log(result);
    return result;
  } catch (err) {
    console.error('Error fetching post:', err);
    return null;
  }
}
