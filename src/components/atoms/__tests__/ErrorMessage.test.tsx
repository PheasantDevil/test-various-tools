import { fireEvent, render, screen } from '@testing-library/react';
import ErrorMessage from '../ErrorMessage';

describe('ErrorMessage', () => {
  test('renders error message correctly', () => {
    const message = 'Test error message';
    render(<ErrorMessage message={message} />);

    expect(screen.getByText(message)).toBeInTheDocument();
  });

  test('renders retry button when onRetry is provided', () => {
    const message = 'Test error message';
    const onRetry = jest.fn();
    render(<ErrorMessage message={message} onRetry={onRetry} />);

    const retryButton = screen.getByText('再試行');
    expect(retryButton).toBeInTheDocument();

    // ボタンをクリックするとonRetry関数が呼ばれることを確認
    fireEvent.click(retryButton);
    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  test('does not render retry button when onRetry is not provided', () => {
    const message = 'Test error message';
    render(<ErrorMessage message={message} />);

    expect(screen.queryByText('再試行')).not.toBeInTheDocument();
  });
});
