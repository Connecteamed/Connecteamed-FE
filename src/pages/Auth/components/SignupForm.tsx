import { useState, type FormEvent } from 'react';
import Button from '@/components/Button';
import Input from '@/components/Input';

const SignupForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const placeholderClass = 'placeholder:text-neutral-70';

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  };

  return (
    <div className="flex flex-col w-full">
      <header className="mb-10">
        <h1 className="text-[42px] text-black font-medium">회원가입</h1>
      </header>

      <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-2">
          <label className="text-sm font-bold text-black">이름</label>
          <Input
            name="name"
            placeholder="이름을 입력하세요"
            className={`h-14 ${placeholderClass}`}
          />
        </div>

        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-black">아이디</label>
            <div className="flex gap-3">
              <Input
                name="userId"
                placeholder="아이디 (6~12자 이내 영문/숫자/기호)"
                className={`flex-1 h-14 ${placeholderClass}`}
              />
              <Button
                type="button"
                variant="secondary"
                className="w-25 h-14 shrink-0 whitespace-nowrap"
              >
                중복확인
              </Button>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-black">비밀번호</label>
            <Input
              name="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="비밀번호 (영문, 숫자, 기호 조합 8자 이상)"
              className={`h-14 ${placeholderClass}`}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-black">비밀번호 확인</label>
            <Input
              name="passwordConfirm"
              type="password"
              placeholder="비밀번호를 다시 입력하세요"
              className={`h-[56px] ${placeholderClass}`}
            />
          </div>
        </div>

        <Button type="submit" className="h-15 mt-4 text-[18px] font-semibold">
          회원가입
        </Button>
      </form>

      <footer className="mt-10 text-center">
        <p className="text-[16px] text-black">
          이미 계정이 있으신가요?
          <a className="ml-2 font-bold text-primary-500 hover:underline" href="/login">
            로그인
          </a>
        </p>
      </footer>
    </div>
  );
};

export default SignupForm;
