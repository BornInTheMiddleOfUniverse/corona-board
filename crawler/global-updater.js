import _ from 'lodash';
import fs from 'fs';
import path from 'path';
import { format, utcToZonedTime } from 'date-fns-tz';
import GlobalCrawler from './global-crawler';

const crawlAndUpdateGlobal = async (outputPath, apiClient) => {
  let prevData = {};
  const globalStatPath = path.join(outputPath, 'global-stat.json');
  try {
    prevData = JSON.parse(fs.readFileSync(globalStatPath, 'utf-8'));
  } catch (e) {
    console.log('previous globalStat not found');
  }

  const globalCrawler = new GlobalCrawler();

  const now = new Date();
  const timeZone = 'Asia/Seoul';
  const crawledDate = format(utcToZonedTime(now, timeZone), 'yyyy-MM-dd');

  const newData =  {
    crawledDate,
    globalStat: await globalCrawler.crawlStat(),
  };

  if (_.isEqual(newData, prevData)) {
    console.log('globalStat has not been changed');
    return;
  }

  fs.writeFileSync(globalStatPath, JSON.stringify(newData));

  const newGlobalStat = newData.globalStat
  const resp = await apiClient.findAllGlobalStat();
  //difference btw  resp.result.filter  vs.  resp.filter  ??
  const oldRows = resp.result.filter((x) => x.date === crawledDate);
  const oldGlobalStat = _.keyBy(oldRows, 'cc');

  const updatedRows = findUpdatedRows(newGlobalStat, oldGlobalStat);
  if (_.isEmpty(updatedRows)) {
    console.log('No updated globalStat rows');
    return;
  }

  // 변경 부분을 API 서버에 업데이트
  for (const row of updatedRows) {
    await apiClient.upsertGlobalStat({
      date: crawledDate,
      ...row,
    });
  }

  console.log('globalStat updated successfully');
}

const findUpdatedRows = (newRowsByCc, oldRowsByCc) => {
  const updatedRows = [];
  for (const cc of Object.keys(newRowsByCc)) {
    const newRow = newRowsByCc[cc];
    const oldRow = oldRowsByCc[cc];

    //한국은 생략
    if (cc === 'KR' && oldRow) {
      continue;
    }

    if (isRowEqual(newRow, oldRow)) {
      continue;
    }

    updatedRows.push(newRow);
  }

  return updatedRows;
}

const isRowEqual = (newRow, prevRow) => {
  const colsToCompare = [
    'confirmed',
    'death',
    'released',
    'critical',
    'tested',
  ];
  if (!prevRow) {
    return false;
  }
  return colsToCompare.every((col) => newRow[col] === prevRow[col]);
}

export default crawlAndUpdateGlobal ;
