import { type FormEvent, useState } from 'react';

import { useNavigate } from 'react-router-dom';

import { postLogin } from '@/apis/auth';

import Button from '@/components/Button';
import Input from '@/components/Input';

import iconError from '@/assets/icon-error.svg';
import iconEye from '@/assets/icon-eye.svg';
import iconGoogle from '@/assets/icon-google.svg';
import iconKakao from '@/assets/icon-kakao.svg';
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
      if (response.status === 'success' && response.data) {
        localStorage.setItem('accessToken', response.data.accessToken);
        localStorage.setItem('refreshToken', response.data.refreshToken);
        setIsError(false);
        navigate('/');
        return;
      }
    } catch (error) {
      console.error(error);
      setIsError(true);
    }
  };

  const placeholderClass = 'placeholder:text-neutral-70';

  // const handleGoogleLogin = () => { }
  // const handleKakaoLogin = () => { }

  return (
    <div className="flex w-full flex-col">
      <header className="mb-4 md:mb-10">
        <h1 className="text-center text-[24px] font-bold text-black md:text-start md:text-[42px]">
          Connecteamed
        </h1>
        <p className="mt-2 text-center text-[12px] font-medium text-gray-500 md:text-start md:text-[18px]">
          팀을 연결하는 가장 쉬운 방법
        </p>
      </header>

      <form
        className="border-neutral-40 flex flex-col border-b pb-4 md:gap-6 md:pb-10"
        onSubmit={handleSubmit}
      >
        <div className="flex flex-col gap-4 md:gap-6">
          <div className="flex flex-col gap-2">
            <div className="relative flex items-center">
              <img src={iconLogin} className="absolute left-3.5 z-10 h-[10.5px] md:h-6 md:w-6" />
              <Input
                name="userId"
                placeholder="아이디를 입력하세요"
                rounded="rounded-[5px] md:rounded-xl"
                className={`h-[38px] w-full pr-12 pl-12 text-[12px] shadow-md md:h-14 md:text-[18px] ${placeholderClass} ${isError ? 'ring-error ring-1' : ''}`}
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <div className="relative flex items-center">
              <img src={iconPassword} className="absolute left-3.5 z-10 h-[10.5px] md:h-6 md:w-6" />

              <Input
                name="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="비밀번호를 입력하세요"
                rounded="rounded-[5px] md:rounded-xl"
                className={`h-[38px] w-full pr-12 pl-12 text-[12px] shadow-md md:h-14 md:text-[18px] ${placeholderClass} ${isError ? 'ring-error ring-1' : ''}`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 flex items-center justify-center focus:outline-none"
              >
                <img
                  src={showPassword ? iconOpenEye : iconEye}
                  className="h-[14px] w-[14px] md:h-6 md:w-6"
                />
              </button>
            </div>
          </div>
        </div>

        {isError && (
          <div className="mt-2 flex items-start justify-start gap-2 md:mt-4">
            <img src={iconError} alt="error" className="mt-1 h-[14px] w-[14px] md:h-4.5 md:w-4.5" />
            <div className="flex flex-col">
              <p className="text-error text-[10px] font-medium md:text-[16px]">
                아이디 또는 비밀번호가 올바르지 않습니다.
              </p>
              <p className="text-neutral-70 text-[10px] md:text-xs">다시 입력해주세요</p>
            </div>
          </div>
        )}

        <Button
          type="submit"
          variant="secondary"
          size="sm"
          className="mt-4 h-[38px] text-[16px] font-medium md:h-15 md:text-[18px] md:font-semibold"
        >
          로그인
        </Button>
      </form>
      <div className="border-neutral-40 flex flex-col border-b pb-4">
        <button
          type="button"
          className="relative mt-4 flex h-[38px] w-full items-center rounded-md bg-[#f2f2f2] text-[14px] font-normal md:h-15"
        >
          <img
            src={iconGoogle}
            alt="google"
            className="absolute left-4 h-[14px] w-[14px] md:h-5 md:w-5"
          />
          <span className="mx-auto">Google 로그인</span>
        </button>

        <button
          type="button"
          className="relative mt-4 flex h-[38px] w-full items-center rounded-md bg-[#fee500] text-[14px] font-normal md:h-15"
        >
          <img
            src={iconKakao}
            alt="kakao"
            className="absolute left-4 h-[14px] w-[14px] md:h-5 md:w-5"
          />
          <span className="mx-auto">카카오 로그인</span>
        </button>
      </div>

      <footer className="mt-4 md:mt-10">
        <p className="text-[14px] text-black md:text-[16px]">
          아직 계정이 없으신가요?
          <a
            className="text-primary-500 ml-2 font-normal hover:underline md:font-bold"
            href="/signup"
          >
            회원가입
          </a>
        </p>
      </footer>
    </div>
  );
};

export default LoginForm;
