'use client';

import React, { useState, useEffect, use } from 'react';
import { supabase } from '@/lib/supabase';
import ChangePost from '@/components/ui/changePost';

interface PostFormProps {
  title: string;
  slug: string;
  mode: boolean;
  content: string;
  creator: string;

  setSlug: (value: string) => void;
  setTitle: (value: string) => void;
  setMode: (value: boolean) => void;
  setContent: (value: string) => void;

  // handleSubmit: (e: React.FormEvent) => void; // Убираем, т.к. будем модифицировать
}

interface PostData {
  id: number;
  title: string;
  slug: string;
  html: boolean;
  post: string;
  creator: string | null;
  created_at: string;
}

export default function CreatePost({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const [postData, setPostData] = useState<PostData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const currentPostSlug = use(params).slug;

  useEffect(() => {
    async function checkAdmin() {
      const storedName = localStorage.getItem('name');
      const storedPass = localStorage.getItem('password');

      if (!storedName || !storedPass) {
        setIsAdmin(false);
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('admins')
          .select('*')
          .eq('name', storedName)
          .eq('password', storedPass)
          .single();

        if (error || !data) {
          setIsAdmin(false);
        } else {
          setIsAdmin(true);
        }
      } catch (err) {
        setIsAdmin(false);
      }
    }

    checkAdmin();
  }, []);

  useEffect(() => {
    async function fetchPost() {
      setLoading(true);
      setError(null);
      try {
        const { data, error: fetchError } = await supabase
          .from('posts')
          .select('*')
          .eq('slug', currentPostSlug)
          .single();

        if (fetchError) {
          throw fetchError;
        }

        if (data) {
          setPostData({
            id: data.id,
            title: data.title,
            slug: data.slug,
            html: data.html,
            post: data.post,
            creator: data.creator,
            created_at: data.created_at,
          });
          setTitle(data.title);
          setSlug(data.slug);
          setMode(data.html);
          setContent(data.post);
          setCreator(data.creator);
        } else {
          throw new Error('Post not found');
        }
      } catch (err: any) {
        console.error('Error fetching post:', err);
        setError(err.message || 'Failed to fetch post');
        setPostData(null);
      } finally {
        setLoading(false);
      }
    }

    if (currentPostSlug) {
      fetchPost();
    } else {
      setLoading(false);
    }
  }, [currentPostSlug]);
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [mode, setMode] = useState(false);
  const [content, setContent] = useState('');
  const [creator, setCreator] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);
    setError(null);

    try {
      console.log(currentPostSlug);
      const { data, error: updateError } = await supabase
        .from('posts')
        .update({
          title: title,
          slug: slug,
          post: content,
          html: mode,
        })
        .eq('slug', currentPostSlug)
        .select();
      console.log(title);
      console.log(slug);
      console.log(content);
      console.log(mode);
      if (updateError) {
        throw updateError;
      }

      if (data && data.length > 0) {
        alert('Post updated successfully!');
      }
    } catch (err: any) {
      console.error('Error updating post:', err);
      setError(err.message || 'Failed to update post.');
      alert('Error updating post: ' + (err.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (isAdmin === false) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="max-w-md w-full p-8 rounded-xl shadow-sm border border-red-100 text-center">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h1 className="text-xl font-bold text-gray-800 mb-2">
            Access Denied
          </h1>
          <p className="text-gray-600">
            You do not have administrator privileges to create posts.
          </p>
        </div>
      </div>
    );
  }

  return (
    <ChangePost
      title={title}
      slug={slug}
      mode={mode}
      setSlug={setSlug}
      setTitle={setTitle}
      setMode={setMode}
      content={content}
      setContent={setContent}
      handleSubmit={handleSubmit}
      creator={creator}
    />
  );
}
