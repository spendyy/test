'use client';

import { useRouter } from 'next/navigation';

interface TableRowProps {
  id: string;
  created_at: string;
  title: string;
  slug: string;
  creator: string;
  onEdit: (slug: string) => void;
  onDelete: (id: string) => void;
  isAdmin: boolean;
}

export default function TableRow({
  id,
  created_at,
  title,
  slug,
  creator,
  onEdit,
  onDelete,
  isAdmin,
}: TableRowProps) {
  const router = useRouter();

  const handleRowClick = () => {
    router.push(`/posts/${slug}`);
  };

  return (
    <tr
      onClick={handleRowClick}
      className="cursor-pointer border-b border-gray-200 hover:bg-gray-100 transition-colors"
    >
      <td className="py-3 px-6 text-left whitespace-nowrap">{created_at}</td>
      <td className="py-3 px-6 text-left font-medium">{title}</td>
      <td className="py-3 px-6 text-left">{'/' + slug}</td>
      <td className="py-3 px-6 text-center font-medium">{creator}</td>

      {isAdmin && (
        <td className="py-3 px-6 text-center">
          <div className="flex items-center justify-center">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit(slug);
              }}
              className="cursor-pointer w-4 mr-2 transform hover:text-blue-500 hover:scale-110"
              aria-label="Edit"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                />
              </svg>
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(id);
              }}
              className="cursor-pointer w-4 mr-2 transform hover:text-red-500 hover:scale-110"
              aria-label="Delete"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </button>
          </div>
        </td>
      )}
    </tr>
  );
}
