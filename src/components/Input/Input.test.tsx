import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';

import Input from './Input';

describe('Input component', () => {
  it('renders label and input correctly', () => {
    render(<Input id="username" labelText="Username" />);

    const label = screen.getByText('Username');
    const input = screen.getByLabelText('Username');

    expect(label).toBeInTheDocument();
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('id', 'username');
  });

  it('applies type, name, and value props correctly', () => {
    render(
      <Input
        id="email"
        type="email"
        name="userEmail"
        value="test@example.com"
        labelText="Email"
      />
    );

    const input = screen.getByLabelText('Email') as HTMLInputElement;
    expect(input.type).toBe('email');
    expect(input.name).toBe('userEmail');
    expect(input.value).toBe('test@example.com');
  });

  it('applies error class when errorMessage is provided', () => {
    render(
      <Input id="password" labelText="Password" errorMessage="Required" />
    );

    const input = screen.getByLabelText('Password');
    expect(input).toHaveClass('input-field--error');
  });

  it('renders right icon when provided', () => {
    render(
      <Input
        id="search"
        labelText="Search"
        rightIcon={<span data-testid="icon">🔍</span>}
      />
    );

    const icon = screen.getByTestId('icon');
    expect(icon).toBeInTheDocument();
  });

  it('calls onChange with correct value', () => {
    const handleChange = vi.fn();
    render(<Input id="name" labelText="Name" onChange={handleChange} />);

    const input = screen.getByLabelText('Name');
    fireEvent.change(input, { target: { value: 'John' } });

    expect(handleChange).toHaveBeenCalledTimes(1);
    expect((input as HTMLInputElement).value).toBe('John');
  });
});
