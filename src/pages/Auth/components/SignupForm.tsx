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
      <header className="mb-4 md:mb-10">
        <h1 className="text-start text-[24px] font-medium text-black md:text-[42px] md:font-bold">
          회원가입
        </h1>
      </header>

      <form
        className="border-neutral-40 flex flex-col border-b pb-4 md:gap-6 md:pb-10"
        onSubmit={handleSubmit}
      >
        <div className="flex flex-col gap-4 md:gap-6">
          {/* 이름 */}
          <div className="flex flex-col gap-[6px] md:gap-2">
            <label className="text-[12px] font-medium text-black md:text-sm md:font-bold">
              이름
            </label>
            <Input
              name="name"
              value={form.name}
              onChange={handleInputChange}
              placeholder="이름을 입력하세요"
              rounded="rounded-[5px] md:rounded-xl"
              className={`h-[38px] w-full pr-12 pl-3.5 text-[12px] shadow-md md:h-14 md:text-[18px] ${placeholderClass}`}
            />
          </div>

          {/* 아이디 */}
          <div className="flex flex-col gap-[6px] md:gap-2">
            <label className="text-[12px] font-medium text-black md:text-sm md:font-bold">
              아이디
            </label>
            <div className="flex gap-2 md:gap-3">
              <Input
                name="userId"
                value={form.userId}
                onChange={handleInputChange}
                placeholder="아이디 (6~12자 이내 영문/숫자/기호)"
                rounded="rounded-[5px] md:rounded-xl"
                className={`h-[38px] flex-1 text-[12px] shadow-md md:h-14 md:text-[18px] ${placeholderClass} ${
                  idError ? 'ring-error ring-1' : isIdChecked ? 'ring-success ring-1' : ''
                }`}
              />
              <Button
                type="button"
                onClick={handleIdCheck}
                disabled={isIdChecked || !isIdValid}
                variant="secondary"
                className="h-[38px] shrink-0 rounded-[5px] px-3 text-[12px] font-medium whitespace-nowrap text-white md:h-12 md:rounded-md md:px-4 md:text-sm"
              >
                중복확인
              </Button>
            </div>
            {idError && <p className="text-error ml-1 text-xs">{idError}</p>}
          </div>

          {/* 비밀번호 */}
          <div className="flex flex-col gap-[6px] md:gap-2">
            <label className="text-[12px] font-medium text-black md:text-sm md:font-bold">
              비밀번호
            </label>
            <div className="relative">
              <Input
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={form.password}
                onChange={handleInputChange}
                placeholder="비밀번호 (영문, 숫자, 기호 조합 8자 이상)"
                rounded="rounded-[5px] md:rounded-xl"
                className={`h-[38px] w-full pr-12 pl-3.5 text-[12px] shadow-md md:h-14 md:text-[18px] ${placeholderClass} ${
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
          <div className="flex flex-col gap-[6px] md:gap-2">
            <label className="text-[12px] font-medium text-black md:text-sm md:font-bold">
              비밀번호 확인
            </label>
            <Input
              name="passwordConfirm"
              type="password"
              value={form.passwordConfirm}
              onChange={handleInputChange}
              placeholder="비밀번호를 다시 입력하세요"
              rounded="rounded-[5px] md:rounded-xl"
              className={`h-[38px] w-full pr-12 pl-3.5 text-[12px] shadow-md md:h-14 md:text-[18px] ${placeholderClass} ${
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
        </div>

        <Button
          type="submit"
          fullWidth
          disabled={!isFormValid}
          variant="secondary"
          className="mt-4 h-[38px] rounded-[5px] text-[16px] font-medium md:h-15 md:rounded-md md:text-[18px] md:font-semibold"
        >
          회원가입
        </Button>
      </form>

      <footer className="mt-4 md:mt-10">
        <p className="text-[14px] text-black md:text-[16px]">
          이미 계정이 있으신가요?
          <a
            className="text-primary-500 ml-2 font-normal hover:underline md:font-bold"
            href="/login"
          >
            로그인
          </a>
        </p>
      </footer>
    </div>
  );
};

export default SignupForm;
