import React, { useEffect, useState, useCallback, useRef } from 'react';
import styled from 'styled-components';
import TopBar from './TopBar';
import Particle from '../Particle';
import ResultList from '../ResultList';

const Column = styled.div`
  display: flex;
  flex-direction: column;
  overflow: hidden;
  height: 100%;
  background: #f0f3f5;
`;

const EnrollPage = () => {
  const [data, setData] = useState([]);
  const dataRef = useRef([]);

  const updateData = useCallback(res => {
    dataRef.current.unshift(res);
    setData([...dataRef.current]);
  }, []);
  useEffect(() => {
    if (window.Electron) {
      window.Electron.onEnroll((event, res) => {
        const { code, msg } = res;
        if (msg === '请先登录') {
          console.log('res', res);
        } else {
          updateData(res);
          console.log('000000000000');
        }
      });
    }
  }, [updateData]);
  console.log('data', data);
  return (
    <Column>
      <TopBar />
      {/* <Particle /> */}
      <ResultList data={data} />
    </Column>
  );
};

export default EnrollPage;
