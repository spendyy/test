'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React from 'react';

interface Post {
  title: string;
  creator: string | null;
  content: string;
  created_at: string;
}

async function getPostBySlug(slug: string): Promise<Post | null> {
  if (slug !== 'example-post') {
    return {
      title: 'My First Example Post',
      creator: 'John Doe',
      content: `
        <p>This is the content of the first example post. It's written in <strong>HTML</strong> and demonstrates how content is displayed.</p>
        <p>It can contain multiple paragraphs, links, images, and other HTML elements.</p>
        <ul>
          <li>Item 1</li>
          <li>Item 2</li>
          <li>Item 3</li>
        </ul>
        <p>This is the end of the post.</p>
      `,
      created_at: new Date().toISOString(),
    };
  }
  return null;
}

export default function PostPage({ params }: { params: { slug: string } }) {
  const router = useRouter();

  const [post, setPost] = React.useState<Post | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    console.log(params);
    async function loadPost() {
      setLoading(true);
      const fetchedPost = await getPostBySlug(params.slug);
      setPost(fetchedPost);
      setLoading(false);
    }
    loadPost();
  }, [params.slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-500">Loading post...</p>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-sm border border-red-100 text-center">
          <div className="text-red-500 text-5xl mb-4">❌</div>
          <h1 className="text-xl font-bold text-gray-800 mb-2">
            Post Not Found
          </h1>
          <p className="text-gray-600">
            The post you are looking for could not be found.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-8 border border-gray-200">
        <h1 className="text-4xl font-bold text-gray-900 mb-4 leading-tight">
          {post.title}
        </h1>

        <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-200">
          <div className="flex items-center space-x-4">
            <div className="flex flex-col">
              <span className="text-sm font-medium text-gray-500">
                Created by:
              </span>
              <span className="text-base font-semibold text-gray-700">
                {post.creator || 'Anonymous'}
              </span>
            </div>
            <span className="text-sm text-gray-400">•</span>
            <span className="text-sm text-gray-400">
              {new Date(post.created_at).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </span>
          </div>

          <div className="flex space-x-3">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-4 py-2 bg-gray-200 text-gray-700 font-semibold text-sm rounded-lg hover:bg-gray-300 focus:ring-2 focus:ring-gray-300 focus:ring-opacity-50 shadow-md transform active:scale-95 transition-all"
            >
              Go Back
            </button>

            <Link href={`/edit/${params.slug}`} passHref>
              <button
                type="button"
                className="px-4 py-2 bg-blue-500 text-white font-semibold text-sm rounded-lg hover:bg-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 shadow-md transform active:scale-95 transition-all"
              >
                Edit Post
              </button>
            </Link>
          </div>
        </div>

        <div className="prose max-w-none text-gray-800 leading-relaxed">
          {post.content.startsWith('<') ? (
            <div dangerouslySetInnerHTML={{ __html: post.content }} />
          ) : (
            <p>{post.content}</p>
          )}
        </div>
      </div>
    </div>
  );
}
