import { Form } from 'react-router-dom';
import { Input } from '@/components/Input';

import './DynamicFormStyles.scss';

interface FormInputs {
  id: string;
  name?: string;
  labelText?: string;
  value?: string;
  onChange: (value: string) => void;
}

interface DynamicFormProps {
  fields: FormInputs[];
  submitLabel: string;
}

export default function DynamicForm({ fields, submitLabel }: DynamicFormProps) {
  return (
    <Form className="form" method="post">
      {fields.map((field) => (
        <Input
          key={field.id}
          id={field.id}
          name={field.name}
          labelText={field.labelText}
          value={field.value}
          onChange={(e) => field.onChange(e.target.value)}
        />
      ))}
      <button type="submit" className="form__submit-bttn">
        {submitLabel}
      </button>
    </Form>
  );
}
