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
  const [isEnrolling, setIsEnrolling] = useState(false);
  const [progress, setProgress] = useState(0);
  const [stats, setStats] = useState(null);
  const dataRef = useRef([]);
  const mealCountRef = useRef(0);
  const successCountRef = useRef(0);
  const failedCountRef = useRef(0);

  const handleEnrollStart = () => {
    dataRef.current = [];
    setIsEnrolling(true);
    setStats(null);
    setProgress(0);
    successCountRef.current = 0;
    failedCountRef.current = 0;
  };

  const updateData = useCallback(res => {
    if (res === 200) {
      dataRef.current.unshift(res);
    } else {
      dataRef.current.push(res);
    }
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
          setIsEnrolling(false);
          setStats({
            success: successCountRef.current,
            failed: failedCountRef.current
          });
        } else if (code === 100) {
          mealCountRef.current = res.count;
        } else if (code === 120) {
          const ProgressValue = Math.floor(
            (res.finishCount * 100) / mealCountRef.current
          );
          setProgress(ProgressValue);
        } else {
          if (code === 200) {
            successCountRef.current++;
          } else {
            failedCountRef.current++;
          }
          updateData(res);
        }
      });
    }
  }, [handleEnrollFail, updateData]);

  return (
    <Column>
      <TopBar handleEnrollStart={handleEnrollStart} isEnrolling={isEnrolling} />
      {isEnrolling ? (
        <ResultList
          data={data}
          isEnrolling={isEnrolling}
          stats={stats}
          progress={progress}
        />
      ) : (
        <Particle />
      )}
    </Column>
  );
};

EnrollPage.propTypes = {
  handleEnrollFail: PropTypes.func.isRequired
};

export default EnrollPage;
