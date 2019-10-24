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
  const [isSuccess, setIsSuccess] = useState(localStorage.loginTime);
  const onLoginSuccess = () => {
    setIsSuccess(true);
  };
  const handleLogout = () => {
    setIsSuccess(false);
  };

  return (
    <Root>
      {isSuccess ? (
        <EnrollPage handleLogout={handleLogout} />
      ) : (
        <Login onLoginSuccess={onLoginSuccess} />
      )}
    </Root>
  );
};

export default App;
