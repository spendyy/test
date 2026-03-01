'use client';

import Link from 'next/link';
import { getPostBySlug } from '@/app/actions';
import React, { useEffect, useState, use } from 'react';
import { Calendar, User, ArrowLeft } from 'lucide-react';

interface Post {
  title: string;
  creator: string | null;
  content: string;
  created_at: string;
  html: boolean;
  slug: string;
}

export default function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const decodedParams = use(params);
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPost() {
      try {
        setLoading(true);
        const slugPath = decodedParams.slug.startsWith('/')
          ? decodedParams.slug
          : decodedParams.slug;

        const data = await getPostBySlug(slugPath);

        if (data) {
          setPost({
            title: data.title,
            creator: data.creator,
            content: data.post,
            created_at: data.created_at,
            html: data.html,
            slug: data.slug,
          });
        }
      } catch (error) {
        console.error('Failed to fetch post:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchPost();
  }, [decodedParams.slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold text-gray-800">Post not found</h2>
        <Link href="/" className="mt-4 text-blue-600 hover:underline">
          Return to home
        </Link>
      </div>
    );
  }

  const formattedDate = new Date(post.created_at).toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-100 p-8 md:p-12">
        <Link
          href="/"
          className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-blue-600 transition-colors mb-10 group"
        >
          <ArrowLeft className="w-4 h-4 mr-2 transition-transform group-hover:-translate-x-1" />
          Back to Hello
        </Link>

        <header className="mb-10">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6 leading-tight">
            {post.title}
          </h1>

          <div className="flex flex-wrap items-center gap-6 text-gray-500 text-sm border-b border-gray-100 pb-8">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                <User size={16} />
              </div>
              <span>
                By{' '}
                <span className="font-semibold text-gray-900">
                  {post.creator || 'Anonymous'}
                </span>
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar size={16} className="text-gray-400" />
              <span>{formattedDate}</span>
            </div>
          </div>
        </header>

        <article className="prose prose-blue prose-lg max-w-none text-gray-700 leading-relaxed">
          {post.html ? (
            <div dangerouslySetInnerHTML={{ __html: post.content }} />
          ) : (
            <p className=" whitespace-pre-wrap">{post.content}</p>
          )}
        </article>
      </div>
    </div>
  );
}
