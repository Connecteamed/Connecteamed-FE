import { type FormEvent, useState } from 'react';

import { useNavigate } from 'react-router-dom';

import { postLogin } from '@/apis/auth';

import Button from '@/components/Button';
import Input from '@/components/Input';

import iconError from '@/assets/icon-error.svg';
import iconEye from '@/assets/icon-eye.svg';
import iconLogin from '@/assets/icon-login.svg';
import iconOpenEye from '@/assets/icon-open-eye.svg';
import iconPassword from '@/assets/icon-password.svg';

const LoginForm = () => {
  const [isError, setIsError] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const loginId = formData.get('userId') as string;
    const password = formData.get('password') as string;

    try {
      const response = await postLogin(loginId, password);
      if (response.status === 'success') {
        localStorage.setItem('accessToken', response.data.accessToken);
        localStorage.setItem('refreshToken', response.data.refreshToken);
        setIsError(false);
        navigate('/');
      }
    } catch (error) {
      console.error(error);
      setIsError(true);
    }
  };

  const placeholderClass = 'placeholder:text-neutral-70';

  return (
    <div className="flex w-full flex-col">
      <header className="mb-10">
        <h1 className="text-[42px] font-medium text-black">Connecteamed</h1>
        <p className="mt-2 text-[18px] font-medium text-gray-500">팀을 연결하는 가장 쉬운 방법</p>
      </header>

      <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <div className="relative flex items-center">
              <img src={iconLogin} className="absolute left-3.5 z-10 h-6 w-6" />
              <Input
                name="userId"
                placeholder="아이디를 입력하세요"
                className={`h-14 w-full pr-12 pl-12 shadow-md ${placeholderClass} ${isError ? 'ring-error ring-1' : ''}`}
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <div className="relative flex items-center">
              <img src={iconPassword} className="absolute left-3.5 z-10 h-6 w-6" />

              <Input
                name="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="비밀번호를 입력하세요"
                className={`h-14 w-full pr-12 pl-12 shadow-md ${placeholderClass} ${isError ? 'ring-error ring-1' : ''}`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 flex items-center justify-center focus:outline-none"
              >
                <img src={showPassword ? iconOpenEye : iconEye} className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>

        {isError && (
          <div className="flex items-start gap-2">
            <img src={iconError} alt="error" className="mt-1 h-4.5 w-4.5" />
            <div className="flex flex-col">
              <p className="text-error text-[16px] font-medium">
                아이디 또는 비밀번호가 올바르지 않습니다.
              </p>
              <p className="text-neutral-70 text-xs">다시 입력해주세요</p>
            </div>
          </div>
        )}

        <Button type="submit" variant="secondary" className="mt-4 h-15 text-[18px] font-semibold">
          로그인
        </Button>
      </form>

      <footer className="mt-10">
        <p className="text-[16px] text-black">
          아직 계정이 없으신가요?
          <a className="text-primary-500 ml-2 font-bold hover:underline" href="/signup">
            회원가입
          </a>
        </p>
      </footer>
    </div>
  );
};

export default LoginForm;
