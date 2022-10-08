import _ from "lodash";
import fs from "fs";
import path from "path";
import { format, utcToZonedTime } from "date-fns-tz";
import DomesticCrawler from "./domestic-crawler";

const crawlAndUpdateDomestic = async (outputPath, apiClient) => {
  let prevData = {};
  
  //마지막으로 크롤링한 데이터가 output 디렉터리에 파일로 저장되어있다.
  const domesticStatPath = path.join(outputPath, "domestic-stat.json");
  try {
    prevData = JSON.parse(fs.readFileSync(domesticStatPath, "utf-8"));
  } catch (e) {
    console.log("previous domesticStat not found");
  }

  const domesticCrawler = new DomesticCrawler();

  const now = new Date();
  const timeZone = "Asia/Seoul";
  const crawledDate = format(utcToZonedTime(now, timeZone), "yyyy-MM-dd");

  const newData = {
    crawledDate,
    domesticStat: await domesticCrawler.crawlStat(),
  };

  if (_.isEqual(newData, prevData)) {
    console.log("domesticStat has not been changed");
    return;
  }

  fs.writeFileSync(domesticStatPath, JSON.stringify(newData));

  const newDomesticStat = newData.domesticStat;
  const { confirmed, released, death, tested, testing, negative } =
    newDomesticStat.basicStats;

  await apiClient.upsertGlobalStat({
    cc: "KR",
    date: crawledDate,
    confirmed,
    released,
    death,
    tested,
    testing,
    negative,
  });

  // 성별, 나이별 데이터는 현재 날짜에 대한 데이터만 수집하기 때문에 간단하게 키-값을 저장하는 API를 통해 저장
  const { byAge, bySex } = newDomesticStat;
  const value = JSON.stringify({ byAge, bySex });
  await apiClient.upsertKeyValue("byAgeAndSex", value);

  console.log("domesticStat updated successfully");
};

export default crawlAndUpdateDomestic;
