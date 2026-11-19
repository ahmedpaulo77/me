import { render, screen } from '@testing-library/react';
import App from './App';

beforeAll(() => {
  // jsdom مفيهوش IntersectionObserver — بنعمله mock بسيط
  window.IntersectionObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
});

test('renders the portfolio name and main sections', () => {
  render(<App />);

  expect(
    screen.getByRole('heading', { level: 1, name: /ahmed abdelmaqsoud/i }),
  ).toBeInTheDocument();
  expect(
    screen.getByRole('heading', { level: 2, name: 'مشاريعي' }),
  ).toBeInTheDocument();
  expect(
    screen.getByRole('heading', { level: 2, name: 'مهاراتي' }),
  ).toBeInTheDocument();
});
