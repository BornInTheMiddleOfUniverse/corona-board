const SheetApiClientFactory = require('./sheet_api_client_factory');
const SheetDownloader = require('./sheet_downloader');

async function main() {
  try {
    const sheetApiClient = await SheetApiClientFactory.create();
    const downloader = new SheetDownloader(sheetApiClient);

    const spreadsheetId = '1z2d4gBO8JSI8SEotnHDKdcq8EQ9X4O5fWPxeUCAqW1c';

    const notice = await downloader.downloadToJson(
      spreadsheetId,
      'notice',
      'downloaded/notice.json',
    );


    const countryInfo = await downloader.downloadToJson(
      spreadsheetId,
      'countryInfo',
      'downloaded/countryInfo.json',
    );
  } catch (e) {
    console.error(e);
  }
}

main();
