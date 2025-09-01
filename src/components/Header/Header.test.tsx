import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Header from './Header';

describe('Header component', () => {
  it('renders the text "Here must be header"', () => {
    render(<Header />);
    expect(screen.getByText('Here must be header')).toBeInTheDocument();
  });
});
