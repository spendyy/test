'use client';
import { columns } from './columns';
import { supabase } from '@/lib/supabase';
import TableRow from '../components/ui/tableRow';
import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { loginUser } from './actions';

interface Payment {
  id: string;
  created_at: string;
  title: string;
  slug: string;
  creator: string;
  html: string;
  post: string;
}

export default function Home() {
  const router = useRouter();
  const [data, setData] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [userName, setUserName] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const username = localStorage.getItem('name');
      const password = localStorage.getItem('password');
      setUserName(username);

      const { data: supabaseData, error: supabaseError } = await supabase
        .from('posts')
        .select('*');

      if (supabaseError) {
        throw new Error(supabaseError.message);
      }
      if (supabaseData) {
        const newData = supabaseData.map((item: any) => {
          const formattedDate = item.created_at
            ? new Date(item.created_at).toLocaleDateString('ru-RU', {
                day: 'numeric',
                month: 'numeric',
                year: 'numeric',
              })
            : '';
          return {
            id: item.id,
            created_at: formattedDate,
            title: item.title,
            html: item.html,
            slug: item.slug,
            creator: item.creator,
            post: item.post,
          };
        });

        setData(newData);

        console.log('User from storage:', username);
        if (username && password) {
          const result = await loginUser(username, password);
          if (result.success) {
            setIsAdmin(true);
          }
        }
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const [searchTerm, setSearchTerm] = useState('');

  const filteredData = data.filter(
    (item) =>
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.creator.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = async (id: string) => {
    console.log(id);
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        const { error } = await supabase.from('posts').delete().eq('id', id);
        if (error) throw error;

        setData(data.filter((item) => item.id !== id));
        alert('Post deleted successfully!');
      } catch (err: any) {
        alert(`Error deleting post: ${err.message}`);
      }
    }
  };

  const handleEdit = (slug: string) => {
    router.push(`/posts/${slug}/edit`);
  };

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = filteredData.slice(startIndex, endIndex);

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };
  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  if (error)
    return (
      <div className="text-center py-20 text-red-500">
        Error loading posts: {error}
      </div>
    );

  return (
    <div className="flex justify-center w-full min-h-screen bg-gray-100">
      {' '}
      <main className="w-full max-w-5xl px-4 py-2">
        <div className="flex flex-col">
          {(isAdmin && (
            <h1 className="text-3xl font-bold text-center mb-8 mt-4">
              {' '}
              Hello, {userName}
            </h1>
          )) || (
            <h1 className="text-3xl font-bold text-center mb-8 mt-4"> Hello</h1>
          )}

          <div className="flex flex-col md:flex-row justify-between items-center mb-6">
            <div className="w-full md:w-1/3 mb-4 md:mb-0">
              <input
                type="text"
                placeholder="Search posts..."
                className="w-full px-4 py-2 rounded-md border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <a href={isAdmin ? '/new-post' : '/admin'} target="_self">
              {' '}
              <button className="cursor-pointer bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-300">
                {isAdmin ? 'Add New Post' : 'Login'}
              </button>
            </a>
          </div>

          <div className="overflow-x-auto bg-white rounded-lg shadow-md">
            <table className="w-full table-auto">
              <thead className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                <tr>
                  <th className="py-3 px-6 text-left">Created</th>
                  <th className="py-3 px-6 text-left">Title</th>
                  <th className="py-3 px-6 text-left">Slug</th>
                  <th className="py-3 px-6 text-center">Creator</th>
                  {isAdmin ? (
                    <th className="py-3 px-6 text-center">Actions</th>
                  ) : (
                    ''
                  )}
                </tr>
              </thead>

              <tbody className="text-gray-600 text-sm font-light">
                {paginatedData.length > 0 ? (
                  paginatedData.map((item) => (
                    <TableRow
                      key={item.id}
                      id={item.id}
                      created_at={item.created_at}
                      title={item.title}
                      slug={item.slug}
                      creator={item.creator}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                      isAdmin={isAdmin}
                    />
                  ))
                ) : (
                  <tr className="border-b border-gray-200 hover:bg-gray-100">
                    <td colSpan={5} className="py-3 px-6 text-center">
                      No posts found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="flex justify-between items-center mt-6">
            <div>
              <span className="text-sm text-gray-700">
                Showing {startIndex + 1} to{' '}
                {endIndex > filteredData.length
                  ? filteredData.length
                  : endIndex}{' '}
                of {filteredData.length} entries
              </span>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={handlePreviousPage}
                disabled={currentPage === 1}
                className="cursor-pointer px-3 py-1 rounded-md bg-gray-200 text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <button
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                className="cursor-pointer px-3 py-1 rounded-md bg-gray-200 text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
