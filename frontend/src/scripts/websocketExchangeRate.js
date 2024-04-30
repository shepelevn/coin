import { MAX_RATES_ITEMS } from './render/renderCurrency';
import { updateRates } from './currency';
import addSnackbar from './render/snackbar';

export default initExchangeRateStream;

let socketConnectedGlobal = false;

function initExchangeRateStream() {
  const socket = new WebSocket(
    `ws://${window.process.env.API_HOST}/currency-feed`
  );
  const ratesArray = [];

  socket.addEventListener('message', (event) => {
    const messageData = JSON.parse(event.data);

    ratesArray.unshift(messageData);

    if (ratesArray.length > MAX_RATES_ITEMS) {
      ratesArray.pop();
    }

    socketConnectedGlobal = true;

    updateRates(messageData);
  });

  socket.addEventListener('close', () => socketCloseHandler(socket));

  return ratesArray;
}

function socketCloseHandler(socket) {
  if (socketConnectedGlobal) {
    addSnackbar('Прервано соединение с сервером', 'error');
    socketConnectedGlobal = false;
  }

  const timeoutId = setTimeout(() => {
    initExchangeRateStream();
  }, 1000);

  socket.addEventListener('open', () => clearTimeout(timeoutId), {
    once: true,
  });
}
