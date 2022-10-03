import SheetApiClientFactory from './sheet_api_client_factory.js';

const main = (req, res) => {
  try {
    await SheetApiClientFactory.create();
  } catch (e) {
    console.error(e);
  }
}

main();
