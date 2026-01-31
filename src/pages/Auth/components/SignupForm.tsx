import Button from '@/components/Button';
import Input from '@/components/Input';

import { useSignupForm } from '../hooks/useSignupForm';

const SignupForm = () => {
  const placeholderClass = 'placeholder:text-neutral-70';

  const {
    form,
    showPassword,
    setShowPassword,
    isIdChecked,
    idError,
    isIdValid,
    isPwValid,
    isPwConfirmValid,
    isFormValid,
    handleInputChange,
    handleIdCheck,
    handleSubmit,
  } = useSignupForm();

  return (
    <div className="flex w-full flex-col">
      <header className="mb-6">
        <h1 className="text-[42px] font-medium text-black">회원가입</h1>
      </header>

      <form
        className="border-neutral-40 flex flex-col gap-6 border-b pb-10"
        onSubmit={handleSubmit}
      >
        {/* 이름 */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-bold text-black">이름</label>
          <Input
            name="name"
            value={form.name}
            onChange={handleInputChange}
            placeholder="이름을 입력하세요"
            className={`h-12 shadow-md ${placeholderClass}`}
          />
        </div>

        {/* 아이디 */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-bold text-black">아이디</label>
          <div className="flex gap-3">
            <Input
              name="userId"
              value={form.userId}
              onChange={handleInputChange}
              placeholder="아이디 (6~12자 이내 영문/숫자/기호)"
              className={`h-12 flex-1 shadow-md ${placeholderClass} ${
                idError ? 'ring-error ring-1' : isIdChecked ? 'ring-success ring-1' : ''
              }`}
            />
            <Button
              type="button"
              onClick={handleIdCheck}
              disabled={isIdChecked || !isIdValid}
              variant="secondary"
              className="h-12 shrink-0 whitespace-nowrap text-white"
            >
              중복확인
            </Button>
          </div>
          {idError && <p className="text-error ml-1 text-xs">{idError}</p>}
        </div>

        {/* 비밀번호 */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-bold text-black">비밀번호</label>
          <div className="relative">
            <Input
              name="password"
              type={showPassword ? 'text' : 'password'}
              value={form.password}
              onChange={handleInputChange}
              placeholder="비밀번호 (영문, 숫자, 기호 조합 8자 이상)"
              className={`h-12 shadow-md ${placeholderClass} ${
                form.password && !isPwValid
                  ? 'ring-error ring-1'
                  : form.password && isPwValid
                    ? 'ring-success ring-1'
                    : ''
              }`}
            />
            <button type="button" onClick={() => setShowPassword(!showPassword)}></button>
          </div>
          {form.password && !isPwValid && (
            <p className="text-error ml-1 text-xs">
              비밀번호는 8자 이상, 영문, 숫자, 기호를 모두 포함해야 해요
            </p>
          )}
        </div>

        {/* 비밀번호 확인 */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-bold text-black">비밀번호 확인</label>
          <Input
            name="passwordConfirm"
            type="password"
            value={form.passwordConfirm}
            onChange={handleInputChange}
            placeholder="비밀번호를 다시 입력하세요"
            className={`h-2 shadow-md ${placeholderClass} ${
              form.passwordConfirm && !isPwConfirmValid
                ? 'ring-error ring-1'
                : form.passwordConfirm && isPwConfirmValid
                  ? 'ring-success ring-1'
                  : ''
            }`}
          />
          {form.passwordConfirm && !isPwConfirmValid && (
            <p className="text-error ml-1 text-xs">비밀번호가 일치하지 않아요.</p>
          )}
        </div>

        <Button
          type="submit"
          fullWidth
          disabled={!isFormValid}
          variant="secondary"
          className={`mt-4 h-12 text-[18px]`}
        >
          회원가입
        </Button>
      </form>

      <footer className="mt-10">
        <p className="text-[16px] text-black">
          이미 계정이 있으신가요?
          <a className="text-primary-500 ml-2 hover:underline" href="/login">
            로그인
          </a>
        </p>
      </footer>
    </div>
  );
};

export default SignupForm;
