import SheetApiClientFactory from "./sheet_api_client_factory";
import SheetDownloader from "./sheet_downloader";

const main = async(req, res) => {
  try {
    const sheetApiClient = await SheetApiClientFactory.create();
    const downloader = new SheetDownloader(sheetApiClient);

    const spreadsheetId = "1z2d4gBO8JSI8SEotnHDKdcq8EQ9X4O5fWPxeUCAqW1c";

    const notice = await downloader.downloadToJson(
      spreadsheetId,
      "notice",
      "downloaded/notice.json"
    );

    console.log(notice);

    const countryInfo = await downloader.downloadToJson(
      spreadsheetId,
      "countryInfo",
      "downloaded/countryInfo.json"
    );

    console.log(countryInfo);
  } catch (e) {
    console.error(e);
  }
}

main();
