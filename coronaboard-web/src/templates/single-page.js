import React from 'react';
import { Slide } from '../components/slide';

export default function SinglePage({ pageContext }) {
  const { dataSource } = pageContext;
  const { countryByCc, globalStats } = dataSource;
  // console.log(countryByCc);
  // console.log(globalStats);

  return (
    <div>
      <h1>코로나보드</h1>
      <p>createPage is awesome!</p>
      <Slide title="국가별 현황">국가별 현황을 보여준다.</Slide>
      <Slide title={'대한민국 지역별 현황'}>
        대한민국 지역별 현황을 보여줍니다.
      </Slide>
      <Slide title={thirdSlideTitle}>예방 행동 수칙을 보여줍니다.</Slide>
    </div>
  );
};

