import React, { useState, memo, useMemo, useRef } from 'react';
import Link from '@pdeals/next/elements/NextLink';
import { useRouter } from 'next/router';
import {
  Input,
  Button,
  ButtonGroup,
  Modal,
  Row,
  Col,
  Table,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from 'reactstrap';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import { CSVLink } from 'react-csv';

import { CrudApi } from '@pdeals/next/lib/api/crud-api';
import { useNotification } from '@pdeals/next/lib/hooks';
import { footerSumCalculator } from '@pdeals/next/utils/helpers';
import { client } from '@pdeals/next/lib/api/api-client';

interface IActionProps {
  data: any;
  params: any;
  callbacks: { [key: string]: () => void };
}

export const MessageUser = (props: IActionProps) => {
  const [value, setValue] = useState('');

  const handleChangeValue = ({ target: { value } }) => setValue(value);

  const handleSubmit = (event) => {
    event.preventDefault();
    setValue('');
  };

  return (
    <ButtonGroup>
      <Input type="text" placeholder="Send message" bsSize="sm" value={value} onChange={handleChangeValue} />
      <Button className="buttons-copy buttons-html5" color="default" size="sm" type="button" onClick={handleSubmit}>
        Send
      </Button>
    </ButtonGroup>
  );
};

export const Copy = () => {
  return (
    <Button className="buttons-copy buttons-html5" color="default" size="sm">
      Copy
    </Button>
  );
};

export const Print = () => {
  return (
    <Button className="buttons-copy buttons-html5" color="default" size="sm">
      Print
    </Button>
  );
};

export const CanLogin = (props: IActionProps) => {
  const saveItem = async () => {
    try {
      await CrudApi(props.params).save(props.data.id, { canLogin: !props.data.canLogin });
      if (props.callbacks.refetch) props.callbacks.refetch();
    } catch (error) {
      console.log('error', error);
    }
  };

  return (
    <div className="btn-group mr-1 ml-1">
      <span className="mr-1">Login</span>
      <label className="custom-toggle custom-toggle-default">
        <input checked={props.data.canLogin} type="checkbox" onChange={saveItem} />
        <span className="custom-toggle-slider rounded-circle" data-label-off="Off" data-label-on="On" />
      </label>
    </div>
  );
};

export const Disabled = (props: IActionProps) => {
  const saveItem = async () => {
    try {
      await CrudApi(props.params).save(props.data.id, { is_disabled: !props.data.is_disabled });
      if (props.callbacks.refetch) props.callbacks.refetch();
    } catch (error) {
      console.log('error', error);
    }
  };

  return (
    <div className="btn-group mr-1 ml-1">
      <span className="mr-1">Disabled</span>
      <label className="custom-toggle custom-toggle-default">
        <input checked={props.data.is_disabled} type="checkbox" onChange={saveItem} />
        <span className="custom-toggle-slider rounded-circle" data-label-off="Off" data-label-on="On" />
      </label>
    </div>
  );
};

export const DeleteItem = memo(({ data, params, callbacks }: IActionProps) => {
  const { notify } = useNotification();

  const handleDelete = async () => {
    try {
      await CrudApi(params).delete(data.id);
      if (callbacks.goBack) callbacks.goBack();
      if (callbacks.refetch) callbacks.refetch();
      notify('success', 'Success', 'Item has been removed!');
    } catch (error) {
      notify('danger', error.name, error.message);
    }
  };

  return (
    <button title="Delete" className="btn btn-warning btn-sm" type="button" onClick={handleDelete}>
      <i className="ni ni-basket small" />
    </button>
  );
});

export const EditItem = memo(({ params, data }: IActionProps) => (
  <Link href={`${params.uiUrlPrefix}/${data.id}/edit`} as={`${params.uiUrlPrefix}/${data.id}/edit`}>
    <button className="btn btn-outline-primary btn-sm" type="button" title="Edit">
      <i className="ni ni-ruler-pencil small" />
    </button>
  </Link>
));

export const ViewItem = memo(({ data, params }: IActionProps) => (
  <Link href={`${params.uiUrlPrefix}/view/[id]`} as={`${params.uiUrlPrefix}/view/${data.id}`} title="View" className="btn btn-primary btn-sm">
      <i className="ni ni-collection small" />
  </Link>
));

export const CreateItem = memo(({ data, params }: IActionProps) => (
  <Link href={params.uiUrlPrefix} as={`${params.uiUrlPrefix}/create`}>
    <Button color="default" size="sm" type="button">
      <i className="fa fa-plus" /> Create
    </Button>
  </Link>
));

export const ExportTable = memo(({ params }: IActionProps) => {
  const [csvData, setCsvSata] = useState(null);
  const scvRef = useRef<any>();

  const headers = useMemo(
    () =>
      params.listColumns.map((column) => ({
        label: column.text,
        key: column.dataField,
      })),
    [params.listColumns]
  );

  const exportTable = async () => {
    try {
      const resp: any = await CrudApi(params).getObjects({
        isCsv: true,
      });
      setCsvSata(resp.rows);
      setTimeout(() => {
        scvRef?.current?.link?.click();
      }, 0);
    } catch (error) {
      console.log('error', error);
    }
  };

  return (
    <>
      <Button
        className="btn-neutral btn-round btn-icon btn-outline-primary"
        color="default"
        href="#pablo"
        type="submit"
        id="tooltip969372949"
        onClick={exportTable}
        size="sm"
        style={{ marginLeft: 'auto' }}
      >
        <span className="btn-inner--icon mr-1">
          <i className="fas fa-user-edit" />
        </span>
        <span className="btn-inner--text">Export</span>
      </Button>
      {csvData && <CSVLink ref={scvRef} headers={headers} filename="File.csv" data={csvData || []} />}
    </>
  );
});

export const ViewRakeEarnings = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const handleToggleModal = () => setIsOpen((prevIsOpen) => !prevIsOpen);

  const data = [
    {
      id: 1,
      date: '04.06.2020',
      amount: 30,
      payment: 'Visa',
    },
    {
      id: 2,
      date: '12.05.2020',
      amount: 119,
      payment: 'MasterCard',
    },
    {
      id: 3,
      date: '24.11.2020',
      amount: 18,
      payment: 'Visa',
    },
  ];

  const columns = [
    {
      text: 'ID',
      dataField: 'id',
      sort: true,
      footer: '',
    },
    {
      text: 'Date',
      dataField: 'date',
      sort: true,
      footer: '',
    },
    {
      text: 'Amount',
      dataField: 'amount',
      sort: true,
      footer: footerSumCalculator,
    },
    {
      text: 'Payment',
      dataField: 'payment',
      sort: true,
      footer: '',
    },
  ];

  return (
    <>
      <Button color="outline-default" type="button" size="sm" onClick={handleToggleModal}>
        View Rake Earnings
      </Button>
      <Modal isOpen={isOpen} toggle={handleToggleModal} className="modal-dialog-centered modal-secondary">
        <Row className="row-grid justify-content-center">
          <Col className="text-center">
            <h1>Rake Earnings</h1>
            <BootstrapTable
              keyField="id"
              pagination={paginationFactory({
                showTotal: true,
                sizePerPageRenderer: () => null,
              })}
              data={data}
              columns={columns}
              wrapperClasses="table-responsive"
              striped
            />
          </Col>
        </Row>
      </Modal>
    </>
  );
};

export const ViewReferralEarnings = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const handleToggleModal = () => setIsOpen((prevIsOpen) => !prevIsOpen);

  const data = [
    {
      id: 1,
      date: '04.06.2020',
      amount: 30,
      payment: 'Visa',
    },
    {
      id: 2,
      date: '12.05.2020',
      amount: 119,
      payment: 'MasterCard',
    },
    {
      id: 3,
      date: '24.11.2020',
      amount: 18,
      payment: 'Visa',
    },
  ];

  const columns = [
    {
      text: 'ID',
      dataField: 'id',
      sort: true,
      footer: '',
    },
    {
      text: 'Date',
      dataField: 'date',
      sort: true,
      footer: '',
    },
    {
      text: 'Amount',
      dataField: 'amount',
      sort: true,
      footer: footerSumCalculator,
    },
    {
      text: 'Payment',
      dataField: 'payment',
      sort: true,
      footer: '',
    },
  ];

  return (
    <>
      <Button color="outline-default" type="button" size="sm" onClick={handleToggleModal}>
        View Referral Earnings
      </Button>
      <Modal isOpen={isOpen} toggle={handleToggleModal} className="modal-dialog-centered modal-secondary">
        <Row className="row-grid justify-content-center">
          <Col className="text-center">
            <h1>Referral Earnings</h1>
            <BootstrapTable
              keyField="id"
              pagination={paginationFactory({
                showTotal: true,
                sizePerPageRenderer: () => null,
              })}
              data={data}
              columns={columns}
              wrapperClasses="table-responsive"
              striped
            />
          </Col>
        </Row>
      </Modal>
    </>
  );
};

export const ViewPayments = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const handleToggleModal = () => setIsOpen((prevIsOpen) => !prevIsOpen);

  const data = [
    {
      id: 1,
      date: '04.06.2020',
      amount: 30,
      payment: 'Visa',
    },
    {
      id: 2,
      date: '12.05.2020',
      amount: 119,
      payment: 'MasterCard',
    },
    {
      id: 3,
      date: '24.11.2020',
      amount: 18,
      payment: 'Visa',
    },
  ];

  const columns = [
    {
      text: 'ID',
      dataField: 'id',
      sort: true,
      footer: '',
    },
    {
      text: 'Date',
      dataField: 'date',
      sort: true,
      footer: '',
    },
    {
      text: 'Amount',
      dataField: 'amount',
      sort: true,
      footer: footerSumCalculator,
    },
    {
      text: 'Payment',
      dataField: 'payment',
      sort: true,
      footer: '',
    },
  ];

  return (
    <>
      <Button color="outline-default" type="button" size="sm" onClick={handleToggleModal}>
        View Payments
      </Button>
      <Modal isOpen={isOpen} toggle={handleToggleModal} className="modal-dialog-centered modal-secondary">
        <Row className="row-grid justify-content-center">
          <Col className="text-center">
            <h1>User Payments</h1>
            <BootstrapTable
              keyField="id"
              pagination={paginationFactory({
                showTotal: true,
                sizePerPageRenderer: () => null,
              })}
              data={data}
              columns={columns}
              wrapperClasses="table-responsive"
              striped
            />
          </Col>
        </Row>
      </Modal>
    </>
  );
};

export const Confirmation = (props) => {
  const saveItem = async () => {
    try {
      await CrudApi(props.params).save(props.data.id, { confirmed: true });
      if (props.callbacks.refetch) props.callbacks.refetch();
    } catch (error) {
      console.log('error', error);
    }
  };

  return (
    <Button
      className="btn-neutral btn-round btn-icon btn-outline-primary"
      color="default"
      href="#pablo"
      id="tooltip969372949"
      onClick={saveItem}
      disabled={props.data.confirmed}
      size="sm"
      style={{ marginLeft: 'auto' }}
    >
      <span className="btn-inner--icon mr-1">
        <i className="ni ni-check-bold" />
      </span>
      <span className="btn-inner--text">Confirm</span>
    </Button>
  );
};

export const CloneItem = memo(({ data, params }: IActionProps) => (
  <Link href={params.uiUrlPrefix} as={`${params.uiUrlPrefix}/create`}>
    <Button color="default" size="sm" type="button">
      <i className="ni ni-single-copy-04" /> Clone
    </Button>
  </Link>
));

export const StartCrawler = ({ data }) => {
  const { notify } = useNotification();

  const handleStart = async () => {
    const d = await client().get(`/crawlers/start/${data.id}`);
    notify('success', 'Success', 'Started crawling');
  };
  return (
    <Button color="secondary" onClick={handleStart} size="sm">
      START
    </Button>
  );
};

export const MergeAction = () => {
  return (
    <button className="btn btn-outline-default btn-sm" type="button">
      Merge
    </button>
  );
};

export const ReferralRequestsAprroval = () => {
  return (
    <Button color="outline-default" type="button" size="sm">
      Start request approval
    </Button>
  );
};
