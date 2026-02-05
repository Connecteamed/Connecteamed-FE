import { useMemo, useState } from 'react';

import { useNavigate } from 'react-router-dom';

import { checkId, postSignup } from '@/apis/auth';

export type SignupFormState = {
  name: string;
  userId: string;
  password: string;
  passwordConfirm: string;
};

export const useSignupForm = () => {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  const [form, setForm] = useState<SignupFormState>({
    name: '',
    userId: '',
    password: '',
    passwordConfirm: '',
  });

  const [isIdChecked, setIsIdChecked] = useState(false);
  const [idError, setIdError] = useState('');

  const isIdValid = form.userId.length >= 6 && form.userId.length <= 12;

  const isPwValid = useMemo(() => {
    return /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/.test(form.password);
  }, [form.password]);

  const isPwConfirmValid = useMemo(() => {
    return form.passwordConfirm !== '' && form.password === form.passwordConfirm;
  }, [form.password, form.passwordConfirm]);

  const isFormValid = useMemo(() => {
    return form.name !== '' && isIdChecked && isPwValid && isPwConfirmValid;
  }, [form.name, isIdChecked, isPwValid, isPwConfirmValid]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setForm((prev) => ({ ...prev, [name]: value }));

    if (name === 'userId') {
      setIsIdChecked(false);
      setIdError('');
    }
  };

  const handleIdCheck = async () => {
    if (!isIdValid) {
      setIdError('아이디는 6~12자의 영문, 숫자만 사용할 수 있어요');
      return;
    }

    try {
      const res = await checkId(form.userId);

      if (res.status === 'success' && res.data) {
        if (res.data.available) {
          setIdError('');
          setIsIdChecked(true);
        } else {
          setIdError('중복된 아이디가 있습니다.');
          setIsIdChecked(false);
        }
      } else {
        setIdError(res.message ?? '');
        setIsIdChecked(false);
      }
    } catch {
      setIdError('아이디 중복확인 중 오류가 발생했습니다.');
      setIsIdChecked(false);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!isFormValid) return;

    try {
      const res = await postSignup({
        name: form.name,
        loginId: form.userId,
        password: form.password,
      });

      if (res.status === 'success') {
        console.log('회원가입 성공:', res.data);
        navigate('/login');
      } else {
        console.log('회원가입 실패:', res.message);
      }
    } catch {
      console.log('회원가입 중 오류가 발생했습니다.');
    }
  };

  return {
    form,
    showPassword,
    isIdChecked,
    idError,

    setShowPassword,

    isIdValid,
    isPwValid,
    isPwConfirmValid,
    isFormValid,

    handleInputChange,
    handleIdCheck,
    handleSubmit,
  };
};
