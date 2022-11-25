import { render, screen } from '@testing-library/react';
import App from './App';

test('renders VAT Calculator text', () => {
  render(<App />);
  const heading = screen.getByText(/VAT CALCULATOR/i);
  expect(heading).toBeInTheDocument();
});