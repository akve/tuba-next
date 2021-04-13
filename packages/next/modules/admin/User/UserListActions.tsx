import { useState } from 'react';
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

import { CrudApi } from '@pdeals/next/lib/api/crud-api';
import { IActionProps } from '@pdeals/next/components/Crud/CrudList/Actions';
import Link from '@pdeals/next/elements/NextLink';

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
    <>
      <Button type="button" onClick={saveItem}>
        {props.data.canLogin ? 'Disable ' : 'Enable '} Login
      </Button>
    </>
  );
};

export const ViewPokerDeals = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const handleToggleModal = () => setIsOpen((prevIsOpen) => !prevIsOpen);

  return (
    <>
      <Button type="button" onClick={handleToggleModal}>
        View Poker Deals
      </Button>
      <Modal isOpen={isOpen} toggle={handleToggleModal} className="modal-dialog-centered modal-secondary">
        <Row className="row-grid justify-content-center">
          <Col className="text-center">
            <h1>Poker Deals</h1>
            <Table className="align-items-center table-flush" responsive>
              <thead className="thead-light">
                <tr>
                  <th scope="col">ID</th>
                  <th scope="col">Date</th>
                  <th scope="col">Deal</th>
                  <th scope="col">Info</th>
                  <th scope="col" />
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>1</td>
                  <td>02.05.2020</td>
                  <td>Deal</td>
                  <td>Some infotmation</td>
                  <td className="text-right">
                    <UncontrolledDropdown>
                      <DropdownToggle className="btn-icon-only text-light" color="" role="button" size="sm">
                        <i className="fas fa-ellipsis-v" />
                      </DropdownToggle>
                      <DropdownMenu className="dropdown-menu-arrow" right>
                        <DropdownItem href="#pablo" onClick={(e) => e.preventDefault()}>
                          Action
                        </DropdownItem>
                        <DropdownItem href="#pablo" onClick={(e) => e.preventDefault()}>
                          Another action
                        </DropdownItem>
                      </DropdownMenu>
                    </UncontrolledDropdown>
                  </td>
                </tr>
              </tbody>
            </Table>
          </Col>
        </Row>
      </Modal>
    </>
  );
};

export const ViewPokerDealsCell = ({ data }) => {
  return (
    <Link href={`/admin/users/deals/${data.id}`}>
      <a className="btn btn-link btn-block btn-sm" href={`/admin/users/deals/${data.id}`}>
        View Accounts
      </a>
    </Link>
  );
};

export const ViewEarningsCell = ({ data }) => {
  return (
    <Link href={`/admin/users/earnings/${data.id}`}>
      <a className="btn btn-link btn-block btn-sm" href={`/admin/users/earnings/${data.id}`}>
        View Earnings
      </a>
    </Link>
  );
};

export const ViewPaymentsCell = ({ data }) => {
  return (
    <Link href={`/admin/users/user-payments/${data.id}`}>
      <a className="btn btn-link btn-block btn-sm" href={`/admin/users/user-payments/${data.id}`}>
        View Payments
      </a>
    </Link>
  );
};

export const ViewPaymentRequestsCell = ({ data }) => {
  return (
    <Link href={`/admin/users/user-payment-requests/${data.id}`}>
      <a className="btn btn-link btn-block btn-sm" href={`/admin/users/user-payment-requests/${data.id}`}>
        View Payment Requests
      </a>
    </Link>
  );
};

export const ViewReferralReportCell = ({ data }) => {
  return (
    <Link href={`/admin/reports/referrals?user=${data.id}`}>
      <a className="btn btn-link btn-block btn-sm" href={`/admin/reports/referrals?user=${data.id}`}>
        View Referral Earnings
      </a>
    </Link>
  );
};
