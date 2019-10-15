import React from 'react';
import styled from 'styled-components';
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

const EnrollPage = () => (
  <Column>
    <TopBar />
    {/* <Particle /> */}
    <ResultList />
  </Column>
);

export default EnrollPage;
