import React, { useEffect, useState, useCallback, useRef } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Modal } from 'antd';
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

const EnrollPage = ({ handleEnrollFail }) => {
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
          Modal.error({
            title: '认证失效，请重新登录',
            onOk: handleEnrollFail
          });
        } else {
          updateData(res);
        }
      });
    }
  }, [handleEnrollFail, updateData]);
  console.log('data', data);
  return (
    <Column>
      <TopBar />
      {/* <Particle /> */}
      <ResultList data={data} />
    </Column>
  );
};

EnrollPage.propTypes = {
  handleEnrollFail: PropTypes.func.isRequired
};

export default EnrollPage;
