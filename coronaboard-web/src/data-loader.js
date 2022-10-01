import _ from 'lodash';
import countryInfo from '../tools/downloaded/countryInfo.json';
import axios from 'axios';
import { subdays } from 'date-fns';
import { format, utcToZonedTime } from 'date-fns-tz';

async function getDataSource() {
  const countryByCc = _.keyBy(countryInfo, 'cc');
  const globalStats = await generateGlobalStats();

  return { globalStats, countryByCc };
}

async function generateGlobalStats() {
  const apiClient = axios.create({
    baseURL: process.env.CORONABOARD_API_BASE_URL || 'http://localhost:8080',
  });
  const response = await apiClient.get('global-stats');

  const groupedByDate = _.groupBy(response.data.result, 'date');

  const now = newDate('2021-06-05');
  const timeZone = 'Asia/Seoul';
  const today = format(utcToZonedTime(now, timeZone), 'yyyy-MM-dd');
  const yesterday = format(
    utcToZonedTime(subdays(now, 1), timeZone),
    'yyyy-MM-dd',
  );

  if (!groupedByDate[today]) {
    throw new Error('Data for today is missing.');
  }

  return createGlobalStatWithPrevField(
    groupedByDate[today],
    groupedByDate[yesterday],
  );
}

function createGlobalStatWithPrevField(todayStats, yesterdayStats) {
    const yesterdayStatsByCc = _.keyBy(yesterdayStats, "cc");

    const globalStatWithPrev = todayStats.map((todayStat) => {
        const cc = todayStat.cc;
        const yesterdayStat = yesterdayStatsByCc[cc];

        //어제 데이터가 존재하면 오늘 데이터 필드 외에 xxxxPrev 형태로 어제 데이터 필드 추가
        if (yesterdayStat) {
            return {
                ...todayStat,
                confirmedPrev: yesterdayStat.confirmed || 0,
                deathPrev: yesterdayStat.death || 0,
                negativePrev: yesterdayStat.negative || 0,
                releasedPrev: yesterdayStat.released || 0,
                testedPrev: yesterdayStat.tested || 0,
            };
        }
        return todayStat;
    });
    return globalStatWithPrev;
}


module.exports = {
  getDataSource,
};
