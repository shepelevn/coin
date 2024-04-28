import ymapsApi from 'ymaps';

import mapHtml from '../../static-html/map.html';
import { setBlockLoading, unsetBlockLoading } from './renderMain';

export default renderMap;

async function renderMap(serverDataPromise) {
  addStaticMapHtml();

  setBlockLoading('map-loading');

  const serverData = await serverDataPromise;
  const banks = serverData.error ? [] : serverData.payload;

  ymapsApi
    .load(
      'https://api-maps.yandex.ru/2.1/?apikey=eb00149e-146c-4210-8e80-32e16ab4c84f&lang=ru_RU'
    )
    .then((ymaps) => {
      unsetBlockLoading('map-loading');

      const map = createMap(ymaps);
      addBanks(ymaps, map, banks);
    });
}

function addStaticMapHtml() {
  const mainDiv = document.getElementById('main');
  mainDiv.innerHTML = mapHtml;
}

function createMap(ymaps) {
  const map = new ymaps.Map('map', {
    // Координаты центра карты.
    // Порядок по умолчанию: «широта, долгота».
    // Чтобы не определять координаты центра карты вручную,
    // воспользуйтесь инструментом Определение координат.
    // center: [55.769383, 37.638521],
    center: [55.7558, 37.6173],
    // Уровень масштабирования. Допустимые значения:
    // от 0 (весь мир) до 19.
    zoom: 10,
    // controls: [],
    // clickable: false,
    // scrollZoom: false,
    // drag: false,
    // routeEditor: false,
    // behaviors: [],
    // interactivityModel: 'disable',
  });

  map.behaviors.disable(['scrollZoom']);

  return map;
}

function addBanks(ymaps, map, banks) {
  for (const bank of banks) {
    const bankPlacemark = new ymaps.Placemark(
      [bank.lat, bank.lon],
      {},
      {
        // iconLayout: 'default#image',
        // iconImageHref: 'img/contacts/map-dot.svg',
        // iconImageSize: [12, 12],
        // iconImageOffset: [-3, -42]
      }
    );

    map.geoObjects.add(bankPlacemark);
  }
}
