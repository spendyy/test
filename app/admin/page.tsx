'use client';

import { useState } from 'react';
import { loginUser } from '../actions';
import { useRouter } from 'next/navigation';

const LoginForm: React.FC = () => {
  const router = useRouter();

  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const goBackFunc = () => {
    router.back();
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData(e.currentTarget);

    try {
      const result = await loginUser(username, password);

      if (result.success) {
        localStorage.setItem('name', username);
        localStorage.setItem('password', password);
        router.push('/');
      } else {
        setError(result.message);
      }
    } catch (err: any) {
      setError('An unexpected error occurred. Please try again.');
      console.error('Error calling Server Action:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center w-full min-h-screen bg-gray-100">
      <div className="flex items-center justify-center h-screen">
        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded-lg shadow-md w-96"
        >
          <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>
          <div className="mb-4">
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700"
            >
              Username:
            </label>

            <input
              type="text"
              id="username"
              name="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password:
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
            />
          </div>

          {error && (
            <div className=" text-red-500 text-sm mb-4 text-center">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="cursor-pointer w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition duration-200 
                     disabled:opacity-50 disabled:cursor-not-allowed "
          >
            {loading ? 'Logging in...' : 'Login'}{' '}
          </button>

          <button
            type="button"
            onClick={goBackFunc}
            className="cursor-pointer w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition duration-200 
                     disabled:opacity-50 disabled:cursor-not-allowed mt-2"
          >
            Go Back
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
