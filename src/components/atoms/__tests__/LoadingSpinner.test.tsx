import { render } from '@testing-library/react';
import LoadingSpinner from '../LoadingSpinner';

describe('LoadingSpinner', () => {
  test('renders correctly', () => {
    const { container } = render(<LoadingSpinner />);

    // LoadingSpinner コンポーネントが正しくレンダリングされることを確認
    expect(container.firstChild).toHaveClass('loading-spinner');
  });
});
