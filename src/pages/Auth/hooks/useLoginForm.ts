import { type FormEvent, useState } from 'react';

import { useNavigate } from 'react-router-dom';

import { type SocialProvider, getSocialLoginUrl, postLogin } from '@/apis/auth';

type Params = {
  redirectTo?: string;
};

export const useLoginForm = ({ redirectTo = '/' }: Params = {}) => {
  const [isError, setIsError] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const togglePassword = () => setShowPassword((prev) => !prev);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const loginId = String(formData.get('userId') ?? '');
    const password = String(formData.get('password') ?? '');

    try {
      const response = await postLogin(loginId, password);

      if (response.status === 'success' && response.data) {
        localStorage.setItem('accessToken', response.data.accessToken);
        localStorage.setItem('refreshToken', response.data.refreshToken);

        setIsError(false);
        navigate(redirectTo);
        return;
      }

      setIsError(true);
    } catch (error) {
      console.error(error);
      setIsError(true);
    }
  };

  const handleSocialLogin = (provider: SocialProvider) => {
    window.location.href = getSocialLoginUrl(provider);
  };

  return {
    isError,
    showPassword,
    setIsError,
    togglePassword,
    handleSubmit,
    handleSocialLogin,
  };
};
