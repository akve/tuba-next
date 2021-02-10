import { useState, useMemo, useCallback, useEffect } from 'react';
import { inject, observer } from 'mobx-react';
import Link from 'next/link';
import { Card, CardHeader, Row, ButtonGroup, Button, Col } from 'reactstrap';

import { ICrud } from '@pdeals/next/components/Crud/ICrud';
import { CrudApi } from '@pdeals/next/lib/api/crud-api';
import Table from './Table';
import { CreateItem } from '@pdeals/next/components/common/Actions';
import ListFilter from '@pdeals/next/components/Crud/CrudList/ListFilter';

interface IProps {
  params: ICrud;
}

function CrudList(props: IProps) {
  const [data, setData] = useState<any>({ count: 0, rows: [] });
  const [requestParams, setRequestParams] = useState<any>({
    limit: 10,
    offset: 0,
    sort: props.params.options ? (props.params.options.listDefaultSortField || 'id') : 'id',
    sortDirectionIsAsc: props.params.options && props.params.options.listDefaultSortDirection === 'desc' ? false : true,
    filter: props.params.defaultFilter || {},
    userFilter: props.params.defaultUserFilter || [],
  });

  const loadData = useCallback(async () => {
    try {
      const resp: any = await CrudApi(props.params).getObjects({
        ...requestParams,
      });
      setData(resp);
    } catch (e) {
      console.log('error', e);
    }
  }, [props.params.apiUrlPrefix, requestParams]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const updateTableOptions = useCallback((tableOptions) => {
    setRequestParams((prevParams) => ({
      ...prevParams,
      ...tableOptions,
    }));
  }, []);

  const updateFilter = useCallback((userFilter) => {
    setRequestParams((prevParams) => ({
      ...prevParams,
      userFilter,
    }));
  }, []);

  return (
    <>
      <Row>
        <div className="col">
          <Card>
            <CardHeader>
              <Row>
                <Col>
                  {!!props.params.listFilterTopComponent && props.params.listFilterTopComponent()}
                  {props.params.userFilter && (
                  <ListFilter
                      onApplyFilter={updateFilter}
                      fields={props.params.userFilter}
                      tableKey={props.params.tableKey}
                      defaultFields={props.params.defaultUserFilter || []}
                    />
                  )}
                </Col>
                <Col className="text-right">
                  {props.params.options?.isCreatable && <CreateItem params={props.params} data={data} callbacks={{}} />}
                  {props.params.tableActions?.map((Action, index) => (
                    <Action key={`${index}`} params={props.params} data={data} callbacks={{}} />
                  ))}
                </Col>
              </Row>
            </CardHeader>
            <Table
              columns={props.params.listColumns}
              data={data}
              params={props.params}
              loadData={loadData}
              updateTableOptions={updateTableOptions}
            />
          </Card>
        </div>
      </Row>
    </>
  );
}

export default inject('userStore')(observer(CrudList));
