import React, { useState } from 'react';
import styled from 'styled-components';
import EnrollPage from './Enroll';
import Login from './Login';
import 'antd/es/modal/style/css';
import 'antd/es/progress/style/css';

const Root = styled.div`
  display: flex;
  flex-direction: column;
  overflow: hidden;
  height: 100vh;
  width: 100vw;
`;
const App = () => {
  const loginTime = localStorage.getItem('loginTime'); // ms
  const isOverOneDay = Date.now() - loginTime > 23 * 3600 * 1000;
  const [isSuccess, setIsSuccess] = useState(!isOverOneDay);
  const onLoginSuccess = () => {
    setIsSuccess(true);
  };
  const handleEnrollFail = () => {
    localStorage.setItem('loginTime', 0);
    setIsSuccess(false);
  };
  return (
    <Root>
      {isSuccess ? (
        <EnrollPage handleEnrollFail={handleEnrollFail} />
      ) : (
        <Login onLoginSuccess={onLoginSuccess} />
      )}
    </Root>
  );
};

export default App;
