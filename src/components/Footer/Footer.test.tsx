import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';

import Footer from './Footer';

describe('Footer component', () => {
  it('renders the text "Here must be Footer"', () => {
    render(<Footer />);
    expect(screen.getByText('Here must be Footer')).toBeInTheDocument();
  });
});
