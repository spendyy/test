import LoginForm from '../../components/ui/loginForm';

export default async function Home() {
  return (
    <div className="flex justify-center w-full min-h-screen bg-background">
      <LoginForm />
    </div>
  );
}
