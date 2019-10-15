import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Spin } from '@xinghunm/widgets';

const Container = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  position: absolute;
  left: 0;
  top: 0;
  justify-content: center;
  background: rgba(0, 0, 0, 0.2);
`;

const SpinWrapper = styled.div`
  position: relative;
`;

const Tip = styled.div`
  position: relative;
  top: 10px;
`;

const Loading = ({ tip }) => (
  <Container>
    <SpinWrapper>
      <Spin />
      <Tip>{tip}</Tip>
    </SpinWrapper>
  </Container>
);

Loading.propTypes = {
  tip: PropTypes.string
};

export default Loading;
