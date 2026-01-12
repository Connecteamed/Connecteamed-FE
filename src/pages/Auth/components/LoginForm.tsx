import { useState, type FormEvent } from 'react';
import Button from '@/components/Button';
import Input from '@/components/Input';
import iconError from '@/assets/icon-error.svg';
// import iconLogin from '@/assets/icon-login.svg';
// import iconPassword from '@/assets/icon-password.svg';
// import iconEye from '@/assets/icon-eye.svg';

const LoginForm = () => {
  const [isError, setIsError] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsError(true); // 로그인 누르면 무조건 에러 발생
    console.log('로그인 실패 (테스트)');
  };

  const placeholderClass = 'placeholder:text-neutral-70';

  return (
    <div className="flex flex-col w-full">
      <header className="mb-10">
        <h1 className="text-[42px] text-black font-medium">Connecteamed</h1>
        <p className="mt-2 text-[18px] text-gray-500 font-medium">팀을 연결하는 가장 쉬운 방법</p>
      </header>

      <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <Input
              name="userId"
              placeholder="아이디를 입력하세요"
              className={`h-14 shadow-md  ${placeholderClass} ${isError ? '!border-error ring-1 ring-error' : ''}`}
            />
          </div>

          <div className="flex flex-col gap-2">
            <Input
              name="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="비밀번호를 입력하세요"
              className={`h-14 shadow-md ${placeholderClass} ${isError ? '!border-error ring-1 ring-error' : ''}`}
            />
          </div>
        </div>

        {isError && (
          <div className="flex items-start gap-2">
            <img src={iconError} alt="error" className="w-4.5 h-4.5 mt-1" />
            <div className="flex flex-col">
              <p className="text-error text-[16px] font-medium">
                아이디 또는 비밀번호가 올바르지 않습니다.
              </p>
              <p className="text-xs text-neutral-70">다시 입력해주세요</p>
            </div>
          </div>
        )}

        <Button type="submit" className="h-15 mt-4 text-[18px] font-semibold">
          로그인
        </Button>
      </form>

      <footer className="mt-10 text-center">
        <p className="text-[16px] text-black">
          아직 계정이 없으신가요?
          <a className="ml-2 font-bold text-primary-500 hover:underline" href="/signup">
            회원가입
          </a>
        </p>
      </footer>
    </div>
  );
};

export default LoginForm;
