import { authFormSchema, type AuthErrors } from './schema';
import { ValidationError } from 'yup';

export type InputName = 'email' | 'name' | 'password';

interface validateInputProps {
  key: InputName;
  value: string;
  setErrors: React.Dispatch<React.SetStateAction<AuthErrors>>;
}

export const validateInput = async ({ key, value, setErrors }: validateInputProps) => {
  try {
    await authFormSchema.validateAt(key, { [key]: value });
    setErrors((prev) => ({ ...prev, [key]: [{ id: 0, message: '' }], isError: false }));
  } catch (error) {
    if (error instanceof ValidationError) {
      setErrors((prev) => ({
        ...prev,
        [key]: [{ id: 0, message: error.message }],
        isError: true,
      }));
    }
  }
};
