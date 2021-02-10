import { useEffect, useState, useMemo, useCallback, memo } from 'react';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import cellEditFactory from 'react-bootstrap-table2-editor';
import { DropdownMenu, Row, DropdownToggle, UncontrolledDropdown, Col } from 'reactstrap';

import { CrudApi } from '@pdeals/next/lib/api/crud-api';
import { DeleteItem, EditItem } from '@pdeals/next/components/common/Actions';

const defaultSorted = [
  {
    dataField: 'id',
    order: 'asc',
  },
];

const cellEditProps = {
  mode: 'dbclick',
};

const sizePerPageRenderer = ({ options, currSizePerPage, onSizePerPageChange }) => (
  <div className="dataTables_length" id="datatable-basic_length">
    <label>
      Show{' '}
      {
        <select
          name="datatable-basic_length"
          aria-controls="datatable-basic"
          className="form-control form-control-sm"
          onChange={(e) => onSizePerPageChange(e.target.value)}
        >
          {options.map(({ text, page }) => (
            <option value={page} key={page}>
              {text}
            </option>
          ))}
        </select>
      }{' '}
      entries.
    </label>
  </div>
);

const Container = ({ columns, params, data: { count, rows: data }, loadData, updateTableOptions }) => {
  const [page, setPage] = useState(1);
  const [sizePerPage, setSizePerPage] = useState(10);

  const refetchData = useCallback(() => {
    loadData();
  }, []);

  const listColumns = useMemo(() => {
    const listColumns = columns.map((column) => {
      column.editable = !!column.editable;
      if (!column.footer) column.footer = '';
      return column;
    });
    const callbacks = {
      refetch: refetchData,
    };

    if (params.rowActions?.length || params.rowMainActions?.length || params.options?.isDeletable || params.options?.isEditable) {
      listColumns.push({
        dataField: 'action',
        text: '',
        formatter: (cell, row) => (
        <Row style={{ flexWrap: 'nowrap' }}>
          {params.options?.isDeletable && (
            <DeleteItem data={row} params={params} callbacks={callbacks} />
          )}
          {params.options?.isEditable && (
            <EditItem data={row} params={params} callbacks={callbacks} />
          )}
          {params.rowMainActions?.map((Action, index) => (
            <Action data={row} params={params} key={`${index}`} callbacks={callbacks} />
          ))}
          {Boolean(params.rowActions?.length) && (
            <div className="w-100 row justify-content-end pl-3">
              <UncontrolledDropdown>
                <DropdownToggle className="btn-icon-only" color="" role="button" size="sm">
                  <i className="fas fa-ellipsis-v" />
                </DropdownToggle>
                <DropdownMenu className="dropdown-menu-arrow" right>
                  {params.rowActions?.map((Action, index) => (
                    <Action data={row} params={params} key={`${index}`} callbacks={callbacks} />
                  ))}
                </DropdownMenu>
              </UncontrolledDropdown>
            </div>
          )}
        </Row>
        ),
        isDummyField: true,
        footer: '',
      });
    }

    return listColumns;
  }, [params, columns]);

  const saveItem = async (id, fields) => {
    try {
      await CrudApi(params).save(id, fields);
    } catch (error) {
      console.log('error', error);
    }
  };

  const handleTableChange = async (type, { page, sizePerPage, sortField, sortOrder, cellEdit }) => {
    if (type === 'cellEdit') {
      const { rowId, dataField, newValue } = cellEdit;
      await saveItem(rowId, { [dataField]: newValue });
    }

    updateTableOptions({
      limit: sizePerPage,
      offset: (page - 1) * sizePerPage,
      sort: sortField,
      sortDirectionIsAsc: sortOrder !== 'desc',
    });

    setPage(page);
    setSizePerPage(sizePerPage);
  };

  return (
    <BootstrapTable
      remote
      keyField="id"
      data={data}
      columns={listColumns}
      defaultSorted={defaultSorted}
      pagination={paginationFactory({
        page,
        sizePerPage,
        totalSize: count,
        showTotal: true,
        sizePerPageRenderer,
      })}
      cellEdit={cellEditFactory(cellEditProps)}
      onTableChange={handleTableChange}
      wrapperClasses="table-responsive"
      striped
    />
  );
};

export default Container;
