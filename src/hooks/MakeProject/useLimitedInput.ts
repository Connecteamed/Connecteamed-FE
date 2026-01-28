import { useCallback, useState } from 'react';

const useLimitedInput = (maxLength: number) => {
  const [value, setValue] = useState('');

  const handleChange = useCallback(
    (nextValue: string) => {
      setValue(nextValue.slice(0, maxLength));
    },
    [maxLength],
  );

  return {
    value,
    length: value.length,
    maxLength,
    handleChange,
    setValue,
  };
};

export default useLimitedInput;
