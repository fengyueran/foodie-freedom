import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Pagination } from '@xinghunm/widgets';

const Container = styled.div`
  width: 100%;
  height: 100%;
  background: #fff;
`;

const TableView = styled.div`
  width: 100%;
  height: ${({ isShowPagination }) =>
    isShowPagination ? 'calc(100% - 53px)' : '100%'};
  position: relative;
  padding-top: 48px;
  ::before {
    content: '';
    position: absolute;
    display: block;
    left: 0;
    right: 0;
    top: 0;
    height: 48px;
  }
`;

const TableViewHolder = styled.div`
  overflow-y: auto;
  width: 100%;
  height: 100%;
  ${props => props.tableClass}
`;

const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  border-spacing: 0;
  overflow: hidden;
`;

const TableBody = styled.tbody`
  /* @media (hover: hover) {
    :hover {
      tr {
        opacity: 0.6;
        filter: blur(1px);
      }
      tr:hover {
        opacity: 1;
        filter: blur(0px);
      }
    }
  } */
`;

const TableHead = styled.thead`
  border-bottom: 1px solid #ddd6;
  font-weight: bold;
`;

const TableRow = styled.tr`
  height: 48px;
  transition: background 0.1s ease;

  &:nth-of-type(odd) {
    background: #fafafa;
  }
  @media (hover: hover) {
    :hover {
      background: #cad2dc;
    }
  }

  & > * {
    transition: opacity 0.2s;
  }
`;

const TableHeadCell = styled.th`
  padding: 0 8px;
  height: 0;
  line-height: 0;
  ::before {
    top: 0;
    height: 48px;
    position: absolute;
    content: attr(data-name);
    line-height: 48px;
  }
`;

const TableCell = styled.td`
  padding: 0 8px;
  width: ${props => props.width || 'auto'};
`;

const PaginationContainer = styled.div`
  display: inline-block;
  padding: 0 5px;
  width: 100%;
  height: 53px;
  border-top: 1px solid rgba(221, 221, 221, 0.5);
  text-align: ${props => props.align || 'right'};
`;

const TablePropTypes = {
  columns: PropTypes.array.isRequired,
  dataSource: PropTypes.array.isRequired,
  onPageChange: PropTypes.func,
  pagination: PropTypes.object,
  tableClass: PropTypes.string
};

const TableDefaultPropTypes = {
  pagination: {
    align: 'right'
  }
};

const DEFAULT_PAGE_SIZE = 10;

const Table = ({
  columns,
  dataSource = [],
  onPageChange,
  pagination,
  tableClass
}) => {
  const [currentPage, setCurrentPage] = useState(0);
  const { current, align } = pagination;
  if (current && current !== currentPage) {
    setCurrentPage(current);
  }

  const pageSize = pagination.pageSize || DEFAULT_PAGE_SIZE;
  const currentPageData = dataSource.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handlePageChange = page => {
    if (!current) {
      setCurrentPage(page);
    }
    if (onPageChange) {
      onPageChange(page);
    }
  };

  const isShowPagination = dataSource.length > pageSize;

  return (
    <Container>
      <TableView isShowPagination={isShowPagination}>
        <TableViewHolder tableClass={tableClass}>
          <StyledTable>
            <TableHead>
              <tr>
                {columns.map(({ name }) => (
                  <TableHeadCell data-name={name} key={name} />
                ))}
              </tr>
            </TableHead>
            <TableBody>
              {currentPageData.map((rowData, index) => (
                <TableRow key={index}>
                  {columns.map(({ dataIndex, width, render }, cellIndex) => (
                    <TableCell key={rowData.key || cellIndex} width={width}>
                      {render
                        ? render(rowData[dataIndex], rowData)
                        : rowData[dataIndex]}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </StyledTable>
        </TableViewHolder>
      </TableView>
      {isShowPagination && (
        <PaginationContainer align={align}>
          <Pagination
            total={dataSource.length}
            current={current}
            pageSize={pageSize}
            onPageChange={handlePageChange}
          />
        </PaginationContainer>
      )}
    </Container>
  );
};

Table.propTypes = TablePropTypes;
Table.defaultProps = TableDefaultPropTypes;

export default Table;
