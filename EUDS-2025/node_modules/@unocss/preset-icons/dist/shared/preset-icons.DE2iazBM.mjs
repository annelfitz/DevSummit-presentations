import { $fetch } from 'ofetch';
import { createCDNFetchLoader } from '../core.mjs';

function createCDNLoader(cdnBase) {
  return createCDNFetchLoader($fetch, cdnBase);
}

export { createCDNLoader as c };
