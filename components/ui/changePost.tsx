import React from 'react';
import dynamic from 'next/dynamic';

const Editor = dynamic(() => import('./editor'), {
  ssr: false,
});

interface CreatePostProps {
  title: string;
  setTitle: (value: string) => void;
  slug: string;
  setSlug: (value: string) => void;
  content: string;
  setContent: (value: string) => void;
  creator: string;
  setHtml: (value: boolean) => void;
  html: boolean;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

export default function ChangePost({
  title,
  setTitle,
  slug,
  setSlug,
  handleSubmit,
  content,
  setContent,
  creator,
  setHtml,
  html,
}: CreatePostProps) {
  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 font-sans text-slate-900">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">
              Create New Post
            </h1>
            <span className="text-xs font-medium px-2 py-1 bg-green-100 text-green-700 rounded-full">
              Admin: {creator}
            </span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Title
              </label>
              <input
                type="text"
                value={title}
                maxLength={45}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="How to cook scrambled eggs"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Slug (URL)
              </label>
              <div className="flex">
                <span className="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                  /posts/
                </span>
                <input
                  type="text"
                  value={slug}
                  maxLength={35}
                  pattern="[a-z]*"
                  lang="en"
                  onChange={(e) => setSlug(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-r-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  required
                  placeholder="Enter your slug in lowercase"
                />
              </div>
            </div>

            <Editor
              setContent={setContent}
              html={html}
              setHtml={setHtml}
              content={content}
            />
          </form>
        </div>
      </div>
    </div>
  );
}
