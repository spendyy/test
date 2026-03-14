'use client';
import React, { useEffect, useRef } from 'react';
import EditorJS from '@editorjs/editorjs';
import { useRouter } from 'next/navigation';
import Header from '@editorjs/header';
import List from '@editorjs/list';

interface CreateEditorProps {
  setContent: (value: string) => void;
  setHtml: (value: boolean) => void;
  html: boolean;
  content: string;
}

export default function Editor({
  setContent,
  setHtml,
  html,
  content,
}: CreateEditorProps) {
  const editorRef = useRef<EditorJS | null>(null);
  const router = useRouter();

  function goBackFunc() {
    router.push('/');
  }

  const handleSave = async () => {
    if (editorRef.current) {
      try {
        const savedData = await editorRef.current.save();
        setContent(JSON.stringify(savedData, null, 2));
      } catch (error) {}
    } else {
      console.warn('Editor.js еще не инициализирован.');
    }
  };

  useEffect(() => {
    if (!editorRef.current) {
      const editor = new EditorJS({
        holder: 'editorjs',
        placeholder: 'Start writing...',

        tools: {
          Header,
          List,
        },
        data:
          html === false && content.length >= 1 ? JSON.parse(content) : content,
      });
      editorRef.current = editor;
    }

    return () => {
      if (
        editorRef.current &&
        typeof editorRef.current.destroy === 'function'
      ) {
        editorRef.current.destroy();
        editorRef.current = null;
      }
    };
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Content Format
        </label>
        <div className="inline-flex p-1 bg-gray-100 rounded-lg">
          <button
            type="button"
            onClick={() => {
              setHtml(false);
              setContent('');
            }}
            className={`cursor-pointer px-4 py-1.5 text-sm font-medium rounded-md transition-all ${
              !html ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500'
            }`}
          >
            Simple Text
          </button>
          <button
            type="button"
            onClick={() => {
              setHtml(true);
              setContent('');
            }}
            className={`cursor-pointer px-4 py-1.5 text-sm font-medium rounded-md transition-all ${
              html ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500'
            }`}
          >
            HTML Code
          </button>
        </div>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-700 mb-1">
          Content
        </label>

        <div className={html ? 'hidden' : 'flex flex-col items-center w-full'}>
          <div
            id="editorjs"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all font-mono text-sm"
          />
        </div>

        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={12}
          className={
            html
              ? 'w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all font-mono text-sm'
              : 'hidden'
          }
          placeholder="Start writing..."
          required
        />
      </div>

      <div className="pt-4 flex items-center justify-between border-t border-gray-100">
        <button
          type="button"
          onClick={goBackFunc}
          className="cursor-pointer px-8 py-2 bg-gray-200 text-gray-700 font-bold rounded-lg hover:bg-gray-300 transition-all"
        >
          Go Back
        </button>
        <button
          onClick={!html ? handleSave : undefined}
          type="submit"
          className="cursor-pointer px-8 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 shadow-md transform active:scale-95 transition-all"
        >
          Publish Post
        </button>
      </div>
    </div>
  );
}
