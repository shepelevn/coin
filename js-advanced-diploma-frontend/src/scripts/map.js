import { handleServerErrors } from './errorHandling';
import { fetchBanks } from './serverApi';
import renderMap from './render/renderMap';

export default openMap;

function openMap() {
  const banksJson = handleServerErrors(() => {
    return fetchBanks();
  });

  renderMap(banksJson);
}
