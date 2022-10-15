const _ = require('lodash');
const { subDays } = require('date-fns');
const { format, utcToZonedTime } = require('date-fns-tz');
const ApiClient = require('./api-client');
const countryInfo = require('../../tools/downloaded/countryInfo.json');
const notice = require('../../tools/downloaded/notice.json');

async function getDataSource() {
  const countryByCc = _.keyBy(countryInfo, 'cc'); 
  const apiClient = new ApiClient();

  const allGlobalStats = await apiClient.getAllGlobalStats();
  const groupedByDate = _.groupBy(allGlobalStats, 'date');

  const globalStats = generateGlobalStats(groupedByDate);
  return {
    lastUpdated: Date.now(),
    globalStats,
    countryByCc,
    notice: notice.filter((x) => !x.hidden),
  };
}

async function generateGlobalStats(groupedByDate) {
  const now = new Date('2021-06-05');
  const timeZone = 'Asia/Seoul';
  const today = format(utcToZonedTime(now, timeZone), 'yyyy-MM-dd');
  const yesterday = format(
    utcToZonedTime(subDays(now, 1), timeZone),
    'yyyy-MM-dd',
  );

  if (!groupedByDate[today]) {
    throw new Error('Data for today is missing');
  }

  return createGlobalStatWithPrevField(
    groupedByDate[today],
    groupedByDate[yesterday],
  );
}

function createGlobalStatWithPrevField(todayStats, yesterdayStats) {
  const yesterdayStatsByCc = _.keyBy(yesterdayStats, 'cc');

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
