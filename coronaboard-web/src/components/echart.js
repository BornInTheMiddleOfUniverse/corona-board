import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';

export function Echart(props) {
  const { wrapperCss, option } = props;
  // 차트가 그려질 DOM 엘리먼트를 참조할 레퍼런스 생성
  const chartRef = useRef(null);

  useEffect(() => {
    const chartInstance = echarts.init(chartRef.current);
    chartInstance.setOption(option);

    // 의존하고있는 상태 변수가 바뀌거나 현재 컴포넌트가 DOM에서 제거될 때(unmount)
    // 사용중인 리소스를 정리 하기 위한 클린업 함수를 정의하여 반환
    return () => {
      chartInstance.dispose();
    };
  }, [option]);

  return <div css={wrapperCss} ref={chartRef} />;
}
