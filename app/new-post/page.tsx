'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import ChangePost from '@/components/ui/changePost';

export default function CreatePost() {
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [content, setContent] = useState('');
  const [mode, setMode] = useState<boolean>(false);
  const [creator, setCreator] = useState<string>('');

  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

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
          setCreator(storedName);
        }
      } catch (err) {
        setIsAdmin(false);
      } finally {
        setLoading(false);
      }
    }

    checkAdmin();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const creatorName = localStorage.getItem('name');

    const { data, error } = await supabase.from('posts').insert([
      {
        title,
        slug: slug,
        post: content,
        creator: creatorName,
        html: mode,
        created_at: new Date().toISOString(),
      },
    ]);

    if (error) {
      alert('Error creating post: ' + error.message);
    } else {
      alert('Post published successfully!');
      setTitle('');
      setContent('');
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
