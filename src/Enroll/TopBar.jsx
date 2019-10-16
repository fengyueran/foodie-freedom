import React, { useEffect } from 'react';
import styled from 'styled-components';
import { Button, utils } from '@xinghunm/widgets';

import LogoIcon from './logo.png';

const Column = styled.div`
  display: flex;
  flex-direction: column;
`;

const Row = styled.div`
  line-height: 24px;
  background: #12578e;
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
  margin-left: 12px;
  color: #e8ecf9;
`;

const Img = styled.img`
  width: 25px;
  height: 25px;
`;

const StyledButton = styled(Button)`
  font-size: 14px;
  color: #ffff;
  border: solid 1px;
  margin-left: 60px;
  border-color: #c0d6e8;
  outline: none;
  padding: 6px 14px;
  border-radius: 3px;
  min-height: 20px;
  padding: 3px 14px;
  background: ${props => props.background || 'none'};
  :hover {
    background: ${props =>
      props.isDisable ? 'none' : utils.fade('#337ab7', 0.2)};
    cursor: ${props => (props.isDisable ? 'not-allowed' : 'pointer')};
  }
  box-shadow: none;
`;

const TitleBar = () => {
  const handleClick = () => {
    if (window.Electron) {
      window.Electron.handleEnroll();
    }
  };
  useEffect(() => {
    if (window.Electron) {
      window.Electron.onEnroll((event, status) => {
        console.log('status', status);
      });
    }
  }, []);
  return (
    <Column>
      <Row>
        <Img src={LogoIcon} />
        <Title>Foodie-Freedom</Title>
        <StyledButton onClick={handleClick}>Fire</StyledButton>
      </Row>
    </Column>
  );
};

export default TitleBar;
