import AuthLayout from './components/AuthLayout';
import LoginForm from './components/LoginForm';

const LoginPage = () => {
  return (
    <AuthLayout mode="login">
      <LoginForm />
    </AuthLayout>
  );
};

export default LoginPage;
