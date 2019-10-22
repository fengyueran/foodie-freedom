/*eslint-disable*/
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
const getPosition = addr =>
  new Promise((resolve, reject) => {
    const myGeo = new BMap.Geocoder();
    myGeo.getPoint(
      addr,
      function(point) {
        if (point) {
          resolve(point);
        } else {
          reject();
        }
      },
      '北京市'
    );
  });

const getDistance = async () => {
  // 创建地址解析器实例
  const pt1 = await getPosition('北京市劲松五区');
  const pt2 = await getPosition('北京市劲松七区708号楼');

  var map = new BMap.Map('allmap');
  var pointA = new BMap.Point(pt1.long, pt1.lat); // 创建点坐标A
  var pointB = new BMap.Point(pt2.long, pt2.lat); // 创建点坐标B
  var range = map.getDistance(pointA, pointB).toFixed(2); //获取两点距离,保留小数点后两位
  console.log('门店距离当前' + range);
};

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
    setData([]);
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

  const isShowParticle = !localStorage.getItem('loginTime');
  const visibility = isEnrolling ? 'hidden' : 'visible';
  const isShowResult = isEnrolling || data.length > 0;
  return (
    <Column>
      <TopBar handleEnrollStart={handleEnrollStart} isEnrolling={isEnrolling} />
      {isShowParticle && <Particle visibility={visibility} />}
      {isShowResult && (
        <ResultList
          data={data}
          isEnrolling={isEnrolling}
          stats={stats}
          progress={progress}
        />
      )}
    </Column>
  );
};

EnrollPage.propTypes = {
  handleEnrollFail: PropTypes.func.isRequired
};

export default EnrollPage;
