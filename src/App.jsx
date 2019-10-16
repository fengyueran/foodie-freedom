import React, { useState } from 'react';
import styled from 'styled-components';
import EnrollPage from './Enroll';
import Login from './Login';

const Root = styled.div`
  display: flex;
  flex-direction: column;
  overflow: hidden;
  height: 100vh;
  width: 100vw;
`;
const App = () => {
  const [isSuccess, setIsSuccess] = useState(false);
  const onLoginSuccess = () => {
    setIsSuccess(true);
  };
  return (
    <Root>
      {isSuccess ? <EnrollPage /> : <Login onLoginSuccess={onLoginSuccess} />}
    </Root>
  );
};

export default App;
