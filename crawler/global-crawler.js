import _ from "lodash";
import axios from "axios";
import cheerio from "cheerio";

//JSON automatically deserializes
import countryInfo from "../tools/downloaded/countryInfo.json";
// const countryInfo = require("../tools/downloaded/countryInfo.json");

class GlobalCrawler {
  constructor() {
    
    this.client = axios.create({
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.93 Safari/537.36",
      },
    });

    //chain() -> fluent style
    this.countryMapping = _.chain(countryInfo)
      .keyBy("worldometer_title")
      .mapValues("cc")
      .value();

  }

  async crawlStat() {
    const url =
      "https://yjiq150.github.io/coronaboard-crawling-sample/clone/worldometer/";
    const resp = await this.client.get(url);
    const $ = cheerio.load(resp.data);

    return this._extractStatByCountry($);
  }

  _extractStatByCountry($) {
    const colNames = $("#main_table_countries_today thead tr th")
      .map((i, th) => {
        return $(th).text().trim();
      })
      .toArray();

    const rows = [];
    $("#main_table_countries_today tbody tr").each((i, tr) => {
      const row = $(tr)
        .find("td")
        .map((j, td) => {
          return $(td).text().trim();
        })
        .toArray();
      rows.push(row);
    });

    if (rows.length === 0) {
      throw new Error(
        "Country rows not found. Site layout may have been changed."
      );
    }

    const colNameToFieldMapping = {
      "Country,Other": "title",
      TotalCases: "confirmed",
      TotalDeaths: "death",
      TotalRecovered: "released",
      TotalTests: "tested",
    };

    const normalizedData = rows
      .map((row) => {
        const countryStat = {};
        for (let i = 0; i < colNames.length; i++) {
          const colName = colNames[i];
          const fieldName = colNameToFieldMapping[colName];
          if (!fieldName) {
            continue;
          }
          const numberFields = ["confirmed", "death", "released", "tested"];
          
          if (numberFields.includes(fieldName)) {
            countryStat[fieldName] = this._normalize(row[i]);
          } else {
            countryStat[fieldName] = row[i];
          }
        }
        return countryStat;
      })
      .filter((countryStat) => this.countryMapping[countryStat.title])
      .map((countryStat) => ({
        ...countryStat,
        cc: this.countryMapping[countryStat.title],
      }));

    return _.keyBy(normalizedData, "cc");
  }

  _normalize(numberText) {
    return parseInt(numberText.replace(/[\s,]*/g, "")) || 0;
  }
}

export default GlobalCrawler;