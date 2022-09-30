const axios = require('axios');
const cheerio = require('cheerio');

async function main() {
    //html로드
    const resp = await axios.get(
        'https://yjiq150.github.io/coronaboard-crawling-sample/dom'
    );
    //
    const $ = cheerio.load(resp.data);
    const elements = $('.slide p');
    //text() 메서드를 사용하기 위해 Node 객체인 el을 $로 감싸서 cheerio 객체로 변환
    //el 변수에 담긴 요소는 cheerio에서 만들어낸 DOM상의 Node 객체인데 cheerio 객체로 감싸주면 cheerio에서 제공하는 기능 사용가능(ex. text())
    elements.each((idx, el) => {
        console.log($(el).text());
    });
}

main();
