import { useState, type FormEvent, useMemo } from 'react';
import Button from '@/components/Button';
import Input from '@/components/Input';

const SignupForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const placeholderClass = 'placeholder:text-neutral-70';

  const [form, setForm] = useState({
    name: '',
    userId: '',
    password: '',
    passwordConfirm: '',
  });

  const [isIdChecked, setIsIdChecked] = useState(false);
  const [idError, setIdError] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (name === 'userId') {
      setIsIdChecked(false); // 아이디 수정 시 중복확인 초기화
      setIdError('');
    }
  };

  // 유효성 검사 로직
  const isIdValid = form.userId.length >= 6 && form.userId.length <= 12;

  // 비밀번호 조건: 8자 이상, 영문/숫자/기호 조합 (정규표현식)
  const isPwValid = /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/.test(form.password);
  const isPwConfirmValid = form.password === form.passwordConfirm && form.passwordConfirm !== '';

  const handleIdCheck = () => {
    if (!isIdValid) {
      setIdError('아이디는 6~12자의 영문, 숫자만 사용할 수 있어요');
      return;
    }

    if (form.userId === 'admin') {
      setIdError('중복된 아이디가 있습니다.');
      setIsIdChecked(false);
    } else {
      setIdError('');
      setIsIdChecked(true);
    }
  };

  // 4. 모든 조건 만족 시 버튼 활성화 (주황색)
  const isFormValid = useMemo(() => {
    return form.name !== '' && isIdChecked && isPwValid && isPwConfirmValid;
  }, [form.name, isIdChecked, isPwValid, isPwConfirmValid]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isFormValid) console.log('회원가입 완료:', form);
  };

  return (
    <div className="flex flex-col w-full">
      <header className="mb-6">
        <h1 className="text-[42px] text-black font-medium">회원가입</h1>
      </header>

      <form
        className="flex flex-col gap-6 pb-10 border-b border-neutral-40"
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
              className={`flex-1 shadow-md h-12 ${placeholderClass} ${
                idError ? 'ring-1 ring-error' : isIdChecked ? 'ring-1 ring-success' : ''
              }`}
            />
            <Button
              type="button"
              onClick={handleIdCheck}
              disabled={isIdChecked || !isIdValid}
              variant="secondary"
              className="h-12 text-white shrink-0 whitespace-nowrap"
            >
              중복확인
            </Button>
          </div>
          {idError && <p className="ml-1 text-xs text-error">{idError}</p>}
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
                  ? 'ring-1 ring-error'
                  : form.password && isPwValid
                    ? 'ring-1 ring-success'
                    : ''
              }`}
            />
            <button type="button" onClick={() => setShowPassword(!showPassword)}></button>
          </div>
          {form.password && !isPwValid && (
            <p className="ml-1 text-xs text-error">
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
                ? ' ring-1 ring-error'
                : form.passwordConfirm && isPwConfirmValid
                  ? ' ring-1 ring-success'
                  : ''
            }`}
          />
          {form.passwordConfirm && !isPwConfirmValid && (
            <p className="ml-1 text-xs text-error">비밀번호가 일치하지 않아요.</p>
          )}
        </div>

        <Button
          type="submit"
          fullWidth
          disabled={!isFormValid}
          variant="secondary"
          className={`h-12 mt-4 text-[18px] `}
        >
          회원가입
        </Button>
      </form>

      <footer className="mt-10">
        <p className="text-[16px] text-black">
          이미 계정이 있으신가요?
          <a className="ml-2 text-primary-500 hover:underline" href="/login">
            로그인
          </a>
        </p>
      </footer>
    </div>
  );
};

export default SignupForm;
