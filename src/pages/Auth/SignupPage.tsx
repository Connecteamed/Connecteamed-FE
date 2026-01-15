import AuthLayout from './components/AuthLayout';
import SignupForm from './components/SignupForm';

const SignupPage = () => {
  return (
    <AuthLayout mode="signup">
      <SignupForm />
    </AuthLayout>
  );
};

export default SignupPage;
