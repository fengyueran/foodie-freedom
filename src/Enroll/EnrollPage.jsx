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
  background: radial-gradient(
    ellipse at center,
    rgba(209, 228, 234, 1) 0%,
    rgba(186, 228, 244, 1) 100%
  );
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

const getDistance = async addr => {
  const pt1 = await getPosition(addr);
  const home = localStorage.getItem('addr');
  const pt2 = await getPosition(home);

  var map = new BMap.Map('allmap');
  var pointA = new BMap.Point(pt1.long, pt1.lat);
  var pointB = new BMap.Point(pt2.long, pt2.lat);
  var distance = map.getDistance(pointA, pointB).toFixed(2); //m
  return distance;
};

const getNearestBranch = branches => {
  let nearestBranch = branches[0].id;
  let minDistance = getDistance(branches[0].title);

  for (let i = 1; i < branches.length; i += 1) {
    const { id, title } = branches[i];
    let distance = getDistance(title);
    if (distance < minDistance) {
      minDistance = distance;
      nearestBranch = id;
    }
  }
  window.Electron.handleDistanceReceived(nearestBranch);
};

const EnrollPage = ({ handleLogout }) => {
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
    if (res.code === 200) {
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
            onOk: handleLogout
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
        } else if (code === 130) {
          getNearestBranch(res.branches);
        } else if (code !== 503) {
          if (code === 200) {
            successCountRef.current++;
          } else {
            failedCountRef.current++;
          }
          updateData(res);
        }
      });
    }
  }, [handleLogout, updateData]);

  const isShowParticle = !localStorage.getItem('play');
  const visibility = isEnrolling ? 'hidden' : 'visible';
  const isShowResult = isEnrolling || data.length > 0;
  return (
    <Column>
      <TopBar
        handleEnrollStart={handleEnrollStart}
        handleLogout={handleLogout}
        isEnrolling={isEnrolling}
        isShowParticle={isShowParticle}
      />
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
  handleLogout: PropTypes.func.isRequired
};

export default EnrollPage;
