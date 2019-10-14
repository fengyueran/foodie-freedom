import React from 'react';
import styled from 'styled-components';
import TopBar from './TopBar';
import Particle from '../Particle';

const Column = styled.div`
  display: flex;
  flex-direction: column;
  overflow: hidden;
  height: 100%;
  background: #f0f3f5;
`;

const EnrollPage = () => (
  <Column>
    <TopBar />
    {/* <Particle /> */}
  </Column>
);

export default EnrollPage;
