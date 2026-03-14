'use client';

import React, { useState, useEffect, use } from 'react';
import { supabase } from '@/lib/supabase';
import ChangePost from '@/components/ui/changePost';

export default function CreatePost({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
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
          setTitle(data.title);
          setSlug(data.slug);
          setContent(data.post);
          setCreator(data.creator);
          setHtml(data.html);
        } else {
          throw new Error('Post not found');
        }
      } catch (err: any) {
        console.error('Error fetching post:', err);
        setError(err.message || 'Failed to fetch post');
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
  const [content, setContent] = useState('');
  const [creator, setCreator] = useState<string>('');
  const [html, setHtml] = useState<boolean>(false);

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
        })
        .eq('slug', currentPostSlug)
        .select();
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
      setSlug={setSlug}
      setTitle={setTitle}
      content={content}
      setContent={setContent}
      handleSubmit={handleSubmit}
      creator={creator}
      html={html}
      setHtml={setHtml}
    />
  );
}
