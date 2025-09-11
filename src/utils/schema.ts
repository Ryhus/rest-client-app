import type { InputError } from '@/components/Inputs/Input/Input';
import * as yup from 'yup';

export const authFormSchema = yup.object({
  name: yup.string().required('Name is required'),
  email: yup
    .string()
    .required('Email is required')
    .matches(
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      'Expected email format: username@example.com'
    ),
  password: yup
    .string()
    .required('Password is required')
    .matches(/(?=.*[a-zA-Z])/, 'Password must contain at least one letter')
    .matches(/(?=.*[0-9])/, 'Password must contain at least one number')
    .min(8, 'Password must be at least 8 characters'),
});

export interface AuthErrors {
  name: InputError[];
  email: InputError[];
  password: InputError[];
  isError: boolean;
}
