import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Home from './Home';

describe('Home component', () => {
  it('renders the text Hello Team!', () => {
    render(<Home />);
    expect(screen.getByText('Hello Team!')).toBeInTheDocument();
  });
});
