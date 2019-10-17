import React, { useEffect, useState, useCallback, useRef } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Modal } from 'antd';
import TopBar from './TopBar';
import Particle from '../Particle';
import ResultList from '../ResultList';
import Loading from '../Loading';

const Column = styled.div`
  display: flex;
  flex-direction: column;
  overflow: hidden;
  height: 100%;
  background: #f0f3f5;
`;

const EnrollPage = ({ handleEnrollFail }) => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const dataRef = useRef([]);

  const handleEnrollStart = () => {
    setIsLoading(true);
  };

  const updateData = useCallback(res => {
    dataRef.current.unshift(res);
    setData([...dataRef.current]);
  }, []);
  useEffect(() => {
    if (window.Electron) {
      window.Electron.onEnroll((event, res) => {
        const { msg, code } = res;
        if (msg === '请先登录') {
          Modal.error({
            title: '认证失效，请重新登录',
            onOk: handleEnrollFail
          });
        } else if (code === 520) {
          setIsLoading(false);
        } else {
          updateData(res);
        }
      });
    }
  }, [handleEnrollFail, updateData]);

  return (
    <Column>
      <TopBar handleEnrollStart={handleEnrollStart} />
      {/* <Particle /> */}
      <ResultList data={data} />
      {isLoading && <Loading tip="报名中..." />}
    </Column>
  );
};

EnrollPage.propTypes = {
  handleEnrollFail: PropTypes.func.isRequired
};

export default EnrollPage;
