import React from 'react';
import { render, screen } from '@testing-library/react';
import SupportiveDadChatbot from './SupportiveDadChatbot';

test('renders learn react link', () => {
  render(<SupportiveDadChatbot />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
