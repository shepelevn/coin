import { formatToRub, formatDate } from '../src/scripts/render/renderUtils';

test('Проверка функции форматирования рубля formatToRub', () => {
  expect(formatToRub(0)).toBe('0,00 ₽');
  expect(formatToRub(1)).toBe('1,00 ₽');
  expect(formatToRub(1.11)).toBe('1,11 ₽');
  expect(formatToRub(1.1199)).toBe('1,12 ₽');
  expect(formatToRub(1000)).toBe('1\xa0000,00 ₽');
  expect(formatToRub(1111111.55)).toBe('1\xa0111\xa0111,55 ₽');
});

test('Проверка функции форматирования даты formatDate', () => {
  expect(formatDate('2023-06-07T12:01:57+00:00')).toBe('7 июня 2023');
  expect(formatDate('1999-01-01T00:00:00+00:00')).toBe('1 января 1999');
  expect(formatDate('2050-08-04T17:06:02+00:00')).toBe('4 августа 2050');
});
