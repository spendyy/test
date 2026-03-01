import { useRouter } from 'next/navigation';
import React from 'react';

interface CreatePostProps {
  title: string;
  setTitle: (value: string) => void;
  slug: string;
  setSlug: (value: string) => void;
  mode: boolean;
  setMode: (value: boolean) => void;
  content: string;
  setContent: (value: string) => void;
  creator: string;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

export default function ChangePost({
  title,
  setTitle,
  slug,
  setSlug,
  mode,
  setMode,
  handleSubmit,
  content,
  setContent,
  creator,
}: CreatePostProps) {
  const router = useRouter();

  function goBackFunc() {
    router.push('/');
  }

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

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Content Format
              </label>
              <div className="inline-flex p-1 bg-gray-100 rounded-lg">
                <button
                  type="button"
                  onClick={() => setMode(false)}
                  className={`cursor-pointer px-4 py-1.5 text-sm font-medium rounded-md transition-all ${
                    mode === false
                      ? 'bg-white shadow-sm text-blue-600'
                      : 'text-gray-500'
                  }`}
                >
                  Simple Text
                </button>
                <button
                  type="button"
                  onClick={() => setMode(true)}
                  className={`cursor-pointer px-4 py-1.5 text-sm font-medium rounded-md transition-all ${
                    mode === true
                      ? 'bg-white shadow-sm text-blue-600'
                      : 'text-gray-500'
                  }`}
                >
                  HTML Code
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Content
              </label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={12}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all font-mono text-sm"
                required
              />
            </div>

            <div className="pt-4 flex items-center justify-between">
              <button
                type="button"
                onClick={goBackFunc}
                className="cursor-pointer px-8 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 shadow-md transform active:scale-95 transition-all"
              >
                Go Back
              </button>
              <button
                type="submit"
                className="cursor-pointer px-8 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 shadow-md transform active:scale-95 transition-all"
              >
                Publish Post
              </button>
            </div>
          </form>
        </div>
      </div>

      {mode === true && content && (
        <div className="max-w-4xl mx-auto mt-8 p-8 bg-white rounded-xl border border-gray-200 shadow-sm">
          <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">
            Live Preview
          </h2>
          <div
            className="prose max-w-none"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        </div>
      )}
    </div>
  );
}
