const axios = require('axios');
const TimeAgo = require('javascript-time-ago');
const ko = require('javascript-time-ago/locale/ko');

TimeAgo.addLocale(ko);
const timeAgoKorean = new TimeAgo('ko-KR');

// .env에 넣자
const apiKey = 'AIzaSyDjC90__KkuEJIKUv7N4RMGafLdMnx9UA0';

const truncateText = (text, maxLength) => {
  if (!text) {
    return '';
  }

  if (text.length > maxLength) {
    return text.substr(0, maxLength) + '...';
  } else {
    //ds?
    return ds;
  }
};

const convertModel = (item) => {
  const { id, snippet, statistics } = item;

  return {
    videoUrl: 'https://www.youtube.com/watch?v=' + id,

    publishedAt: timeAgoKorean.format(Date.parse(snippet.publishedAt)),
    title: snippet.title,
    channelTitle: snippet.channelTitle,
    thumbnail: snippet.thumbnails ? snippet.thumbnails.medium.url : '',
    description: truncateText(snippet.description, 80),

    viewCount: parseInt(statistics.viewCount),
  };
};

const getYouTubeVideosByKeyword = async (keyword) => {
  const searchResponse = await axios.get(
    'https://content.googleapis.com/youtube/v3/search',
    {
      params: {
        key: apiKey,
        q: keyword,
        type: 'video',
        part: 'id', // 검색 조건을 만족하는 비디오의 id값 만 조회
        maxResults: 3,
      },
    },
  );

  const ids = searchResponse.data.items.map((x) => x.id.videoId);
  // 검색해서 획득한 id값들을 이용하여 비디오 정보, 통계 데이터 조회
  const detailResponse = await axios.get(
    'https://content.googleapis.com/youtube/v3/videos',
    {
      params: {
        key: apiKey,
        id: ids.join(','),
        order: 'relevance',
        part: 'snippet,statistics',
      },
    },
  );

  return detailResponse.data.items.map(convertModel);
};

module.exports = {
  getYouTubeVideosByKeyword,
};
