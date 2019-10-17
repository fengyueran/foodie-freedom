import React from 'react';
import PropTypes from 'prop-types';
import { Icon, Progress } from 'antd';
import styled from 'styled-components';
import { LineBox, VerticalBox } from '@xinghunm/widgets';
import Table from './Table';

const Container = styled(VerticalBox)`
  margin-right: auto;
  margin-left: auto;
  height: 100%;
  padding: 20px;
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
  padding: 8px 0;
  ::before {
    position: absolute;
    width: 2px;
    height: 26px;
    left: -15px;
    top: 8px;
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
const ProgressWrapper = styled.div`
  width: calc(100% - 200px);
  margin-left: 100px;
`;

const Stats = styled.div`
  margin-left: 100px;
  span {
    margin: 0 8px;
    font-weight: bold;
  }
`;

const Tag = styled.span`
  color: ${props => props.color};
`;

const columns = [
  {
    name: '',
    width: '10px'
  },
  {
    name: '店名',
    dataIndex: 'title'
  },
  {
    name: '状态',
    dataIndex: 'code',
    render: code =>
      code === 200 ? (
        <Icon type="check" style={{ color: 'green' }} />
      ) : (
        <Icon type="close" style={{ color: 'red' }} />
      )
  },
  {
    name: '说明',
    dataIndex: 'msg'
  }
];

const propTypes = {
  isEnrolling: PropTypes.bool.isRequired,
  progress: PropTypes.number.isRequired,
  stats: PropTypes.instanceOf(Object),
  data: PropTypes.array.isRequired
};

const ResultList = ({ isEnrolling, progress, stats, data }) => {
  return (
    <Container>
      <Header>
        <HeaderTitle>
          <strong>报名结果</strong>
        </HeaderTitle>
        {isEnrolling && (
          <ProgressWrapper>
            <Progress percent={progress} />
          </ProgressWrapper>
        )}
        {stats && (
          <Stats>
            <span>
              共: <Tag>{`${stats.success + stats.failed}`}</Tag>
            </span>
            <span>
              成功: <Tag color="green">{`${stats.success}`}</Tag>
            </span>
            <span>
              失败: <Tag color="red">{`${stats.failed}`}</Tag>
            </span>
          </Stats>
        )}
        <SeparateBar />
      </Header>
      <TableContainer>
        <Table
          columns={columns}
          dataSource={data}
          tableClass="overflow-x: hidden;"
          pagination={{
            pageSize: 100000
          }}
        />
      </TableContainer>
    </Container>
  );
};

ResultList.propTypes = propTypes;

export default ResultList;
