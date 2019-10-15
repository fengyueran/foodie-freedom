import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { LineBox, VerticalBox } from '@xinghunm/widgets';
import Table from './Table';

const Container = styled(VerticalBox)`
  margin-right: auto;
  margin-left: auto;
  height: 100%;
  @media (hover: none) {
    padding: 0;
  }
  @media (min-width: 768px) {
    width: 750px;
  }
  @media (min-width: 992px) {
    width: 970px;
  }
  @media (min-width: 1200px) {
    width: 1170px;
  }
`;

const Header = styled(LineBox)`
  padding: 0 15px;
  border-radius: 3px 3px 0 0;
  background: #ffffff;
  overflow: visible;
  flex-wrap: wrap;
`;

const SeparateBar = styled.div`
  border-bottom: 1px solid #ddd;
  width: 100%;
  height: 1px;
`;

const HeaderTitle = styled.div`
  position: relative;
  color: #457fca;
  ::before {
    position: absolute;
    width: 2px;
    height: 26px;
    left: -15px;
    top: 0;
    content: '';
    background-color: #457fca;
  }
`;

const TableContainer = styled.div`
  overflow: hidden;
  background: #fff;
  width: 100%;
  height: 100%;
`;

const propTypes = {
  columnsData: PropTypes.array.isRequired,
  questions: PropTypes.array.isRequired
};

const ResultList = ({ columnsData, questions }) => {
  return (
    <Container>
      <Header>
        <HeaderTitle>
          <strong>报名结果</strong>
        </HeaderTitle>
        <SeparateBar />
      </Header>
      <TableContainer>
        <Table
          columns={columnsData}
          dataSource={questions}
          tableClass="overflow-x: hidden;"
          pagination={{
            pageSize: 10000000
          }}
        />
      </TableContainer>
    </Container>
  );
};

ResultList.propTypes = propTypes;

export default ResultList;
