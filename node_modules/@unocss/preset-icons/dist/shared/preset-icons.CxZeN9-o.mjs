import { b as createCDNFetchLoader } from './preset-icons.DIW0qOxJ.mjs';

async function createCDNLoader(cdnBase) {
  const { $fetch } = await import('ofetch');
  return createCDNFetchLoader($fetch, cdnBase);
}

export { createCDNLoader as c };
