import React from 'react';
import styled from 'styled-components';

import { Icon } from 'antd';
import { LogoIcon } from '@/assets';

const Column = styled.div`
  display: flex;
  flex-direction: column;
`;

const Row = styled.div`
  line-height: 24px;
  background: #2f3a4f;
  box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.15);
  display: flex;
  width: 100%;
  height: 50px;
  align-items: center;
  color: #e8ecf9;
`;

const Logo = styled(Icon)`
  font-size: 28px;
  margin-left: 24px;
`;

const Title = styled.h1`
  font-size: 18px;
  margin-left: 12px;
  color: #e8ecf9;
`;

const SeperateBar = styled.div`
  height: 2px;
  background-image: linear-gradient(
    90deg,
    #3799f8 11%,
    #52a9ff 15%,
    rgba(30, 141, 250, 0.08) 29%,
    rgba(31, 142, 250, 0.08) 89%
  );
`;

const TitleBar = () => (
  <Column>
    <Row>
      <Logo component={LogoIcon} />
      <Title>Foodie Freedom</Title>
    </Row>
    <SeperateBar />
  </Column>
);

export default TitleBar;
