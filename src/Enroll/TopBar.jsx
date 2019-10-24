import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Button, utils } from '@xinghunm/widgets';

import LogoIcon from './logo.png';

const Column = styled.div`
  display: flex;
  flex-direction: column;
`;

const Row = styled.div`
  line-height: 24px;
  background: #1e7dca;
  box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.15);
  display: flex;
  width: 100%;
  height: 50px;
  align-items: center;
  color: #e8ecf9;
  padding-left: 15px;
  flex-direction: row;
  box-sizing: border-box;
`;

const Title = styled.h1`
  font-size: 18px;
  margin: 0;
  margin-left: 12px;
  color: #e8ecf9;
`;

const Img = styled.img`
  width: 25px;
  height: 25px;
`;

const StyledButton = styled(Button)`
  font-size: 14px;
  color: ${props => (props.isEnrolling ? 'gray' : '#fff')};
  border: solid 1px;
  margin-left: 60px;
  border-color: ${props => (props.isEnrolling ? 'gray' : '#c0d6e8')};
  outline: none;
  padding: 6px 14px;
  border-radius: 3px;
  min-height: 20px;
  padding: 3px 14px;
  background: ${props => props.background || 'none'};
  :hover {
    background: ${props =>
      props.isDisable ? 'none' : utils.fade('#337ab7', 0.2)};
    cursor: ${props => (props.isEnrolling ? 'not-allowed' : 'pointer')};
  }
  box-shadow: none;
`;

const TopBar = ({ isEnrolling, handleEnrollStart }) => {
  const handleClick = () => {
    if (window.Electron && !isEnrolling) {
      handleEnrollStart();
      window.Electron.handleEnroll();
    }
  };

  return (
    <Column>
      <Row>
        <Img src={LogoIcon} />
        <Title>Foodie-Freedom by xinghunm</Title>
        <StyledButton
          onClick={handleClick}
          isEnrolling={isEnrolling}
          hasRipple={!isEnrolling}
        >
          Fire
        </StyledButton>
      </Row>
    </Column>
  );
};

TopBar.propTypes = {
  isEnrolling: PropTypes.bool.isRequired,
  handleEnrollStart: PropTypes.func.isRequired
};

export default TopBar;
