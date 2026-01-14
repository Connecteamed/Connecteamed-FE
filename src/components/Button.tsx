/**
 * Button 컴포넌트
 *
 * @example
 * // Primary 버튼 (주황색) - 기본값
 * <Button onClick={handleClick}>확인</Button>
 *
 * @example
 * // Secondary 버튼 (파란색)
 * <Button variant="secondary">다음</Button>
 *
 * @example
 * // 사이즈 변경
 * <Button size="sm">작은 버튼</Button>
 * <Button size="lg">큰 버튼</Button>
 *
 * @example
 * // 비활성화 (회색으로 표시됨)
 * <Button disabled>클릭 불가</Button>
 *
 * @example
 * // 전체 너비
 * <Button fullWidth>전체 너비 버튼</Button>
 *
 * @example
 * // 커스텀 className 추가
 * <Button className="mt-4">여백 추가</Button>
 */

import { type ButtonHTMLAttributes } from 'react';

/** 버튼 색상 종류 */
type ButtonVariant = 'primary' | 'secondary';

/** 버튼 사이즈 */
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** 버튼 색상: primary(주황), secondary(파랑) */
  variant?: ButtonVariant;
  /** 버튼 크기: sm, md, lg */
  size?: ButtonSize;
  /** 전체 너비 사용 여부 */
  fullWidth?: boolean;
  /** 버튼 내용 */
  children: React.ReactNode;
}

// 색상별 스타일 (disabled는 CSS로 자동 처리)
const variantStyles: Record<ButtonVariant, string> = {
  primary: 'bg-primary-500 text-white hover:bg-primary-700',
  secondary: 'bg-secondary-500 text-white hover:bg-secondary-700',
};

// 사이즈별 스타일
const sizeStyles: Record<ButtonSize, string> = {
  sm: 'px-4 py-2 text-sm rounded-md',
  md: 'px-6 py-3 text-base rounded-lg',
  lg: 'px-8 py-4 text-lg rounded-lg',
};

const Button = ({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  disabled = false,
  children,
  className = '',
  ...props
}: ButtonProps) => {
  return (
    <button
      disabled={disabled}
      className={`
        inline-flex justify-center items-center gap-2
        font-medium transition-colors
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${fullWidth ? 'w-full' : ''}
        ${disabled ? 'bg-neutral-50! text-white! cursor-not-allowed hover:bg-neutral-50' : ''}
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
