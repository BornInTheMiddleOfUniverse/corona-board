const fs = require('fs');
const path = require('path');

class SheetDownloader {
  constructor(apiClient) {
    this.apiClient = apiClient;
  }

  async downloadToJson(spreadsheetId, sheetName, filePath = null) {
    //명시한 시트의 내용을 가져온다.
    const res = await this.apiClient.spreadsheets.values.get({
      spreadsheetId: spreadsheetId,
      range: sheetName,
    });

    //행 데이터 얻어온다.
    const rows = res.data.values;
    if (rows.length === 0) {
      const message = 'No data found on the sheet';
      console.error(message);
      return {};
    }

    //행 데이터(배열)를 객체로 변환
    const object = this._rowsToObject(rows);

    //filePath를 명시했다면 지정한 파일로 저장.
    //변환된 객체는 filePath가 지정된 경우 JSON 형태로 직렬화해서 파일로 저장한다. 
    if (filePath) {
      // 마지막 인수는 space를 의미. 
      // 이곳에 2를 넣으면 출력되는 JSON 문자열에 2칸 들여쓰기와 줄바꿈이 적용되어 보기 편해집니다.
      const jsonText = JSON.stringify(object, null, 2);

      const directory = path.dirname(filePath);
      if (!fs.existsSync(directory)) {
        fs.mkdirSync(directory);
      }
      fs.writeFileSync(filePath, jsonText);
      console.log(`Written to ${filePath}`);
    }
    return object;
  }

  // 주어진 배열을 JSON 객체로 변환
  // @param rows 변환할 2차원 배열
  _rowsToObject(rows) {
    const headerRow = rows.slice(0, 1)[0];
    const dataRows = rows.slice(1, rows.length);

    return dataRows.map((row) => {
      const item = {};
      // 형태?
      for (let i = 0; i < headerRow.length; i++) {
        const fieldName = headerRow[i];
        const fieldValue = row[i];
        item[fieldName] = fieldValue;
      }
      return item;
    });
  }
}

module.exports = SheetDownloader;
