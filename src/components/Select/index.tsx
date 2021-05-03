import {
  useEffect,
  useRef,
  useState,
  useCallback,
  ReactElement,
  SelectHTMLAttributes,
} from 'react';
import { IconBaseProps } from 'react-icons';
import { FiAlertCircle } from 'react-icons/fi';
import { useField } from '@unform/core';

import { Container, Error } from './styles';

interface IOptionsProps {
  optionValue: string;
  optionLabel: string;
  disabled: boolean;
}

interface ISelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  name: string;
  icon: React.ComponentType<IconBaseProps>;
  options: IOptionsProps[];
}

const Select = ({
  name,
  icon: Icon,
  options,
  ...rest
}: ISelectProps): ReactElement => {
  const inputRef = useRef<HTMLSelectElement>(null);

  const [isFocused, setIsFocused] = useState(false);
  const [isFilled, setIsFilled] = useState(false);

  const { fieldName, defaultValue, error, registerField } = useField(name);

  const handleInputFocus = useCallback(() => {
    setIsFocused(true);
  }, []);

  const handleInputBlur = useCallback(() => {
    setIsFocused(false);

    setIsFilled(!!inputRef.current?.value);
  }, []);

  useEffect(() => {
    registerField({
      name: fieldName,
      ref: inputRef.current,
      path: 'value',
    });
  }, [fieldName, registerField]);

  return (
    <Container isErrored={!!error} isFilled={isFilled} isFocused={isFocused}>
      {Icon && <Icon size={20} />}
      <select
        onFocus={handleInputFocus}
        onBlur={handleInputBlur}
        defaultValue={defaultValue}
        ref={inputRef}
        {...rest}
      >
        {options.map(option => (
          <option value={option.optionValue} disabled={option.disabled}>
            {option.optionLabel}
          </option>
        ))}
      </select>

      {error && (
        <Error title={error}>
          <FiAlertCircle color="#ee6c4d" size={20} />
        </Error>
      )}
    </Container>
  );
};

export default Select;