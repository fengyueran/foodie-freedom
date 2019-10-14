import React from 'react';
import styled from 'styled-components';
import EnrollPage from './Enroll';

const Root = styled.div`
  display: flex;
  flex-direction: column;
  overflow: hidden;
  height: 100vh;
  width: 100vw;
`;
const App = () => (
  <Root>
    <EnrollPage />
  </Root>
);

export default App;
