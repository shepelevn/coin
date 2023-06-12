export { formatToRub, formatDate };

function formatToRub(currency) {
  let formatter = new Intl.NumberFormat('ru', {
    style: 'currency',
    currency: 'RUB',
  });

  return formatter.format(currency);
}

function formatDate(date) {
  let formatter = new Intl.DateTimeFormat('ru', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const resultDate = formatter.format(new Date(date));

  // return resultDate.replace(' г.', '');
  return resultDate.slice(0, resultDate.length - 3);
}
