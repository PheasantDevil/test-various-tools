import { formatDate } from '../dateUtils';

describe('dateUtils', () => {
  test('formatDate should format date string correctly', () => {
    const testDate = '2023-01-15T12:30:45Z';
    const formattedDate = formatDate(testDate);

    // 日本語ロケールでのフォーマットをテスト
    // 実際の出力は環境によって異なる可能性があるため、正規表現でチェック
    expect(formattedDate).toMatch(/\d{4}[/-]\d{2}[/-]\d{2}/);
    expect(formattedDate).toMatch(/\d{2}:\d{2}/);
  });

  test('formatDate should handle invalid date', () => {
    const invalidDate = 'not-a-date';

    // 無効な日付の場合は "Invalid Date" または空文字列を返すことを期待
    const formattedDate = formatDate(invalidDate);
    expect(formattedDate).toMatch(/Invalid Date|^$/);
  });
});
