import React, { useEffect } from 'react';
import { inject, observer } from 'mobx-react';
import CrudContainer from '@pdeals/next/components/Crud/CrudContainer';
import { ICrud, IBreadcrumb } from '@pdeals/next/components/Crud/ICrud';

import { MessageUser, CanLogin, ExportTable } from '@pdeals/next/components/common/Actions';
import { footerSumCalculator } from '@pdeals/next/utils/helpers';
import { tableKeys } from '@pdeals/next/variables/constants';
import {
  ViewEarningsCell,
  ViewPokerDealsCell,
  ViewPaymentsCell,
  ViewPaymentRequestsCell,
  ViewReferralReportCell,
} from '@pdeals/next/modules/admin/User/UserListActions';
import {
  LoginAsAction,
  ViewPokerDealsAction,
  ViewEarningsAction,
} from '@pdeals/next/modules/admin/User/UserViewActions';
import { DateCell, FullNameCell } from '@pdeals/next/components/Crud/CrudList/Cells';
//import { UserCategoryLookup, UserRolesLookup } from '@pdeals/models/lookups/UserRoles';

type Props = {};

const MainInner: React.FunctionComponent<Props> = (props) => {
  const params: ICrud = {
    apiUrlPrefix: 'user',
    overrideListUrlPrefix: '/user/list',
    uiUrlPrefix: '/admin/users',
    tableKey: tableKeys.users,
    title: 'Users',
    options: {
      isEditable: true,
      isCreatable: true,
    },
    listColumns: [
      {
        text: 'ID',
        dataField: 'id',
        sort: true,
      },
      {
        text: 'Email',
        dataField: 'email',
        sort: true,
        editable: true,
      },
      {
        text: 'Name',
        dataField: 'lastName',
        formatter: FullNameCell,
      },
      {
        text: 'Referred by',
        dataField: 'referral_name',
      },
      {
        text: 'Users Referred',
        dataField: 'referred_count',
        // footer: footerSumCalculator(),
      },
      {
        text: 'Accounts',
        dataField: 'deals_count',
        // footer: footerSumCalculator(),
      },
      /*
      {
        text: 'Rake',
        dataField: 'rake',
        sort: true,
        footer: footerSumCalculator(),
      },
      {
        text: 'Rakeback',
        dataField: 'rakeBack',
        footer: footerSumCalculator(),
      },
      {
        text: 'Net Rakeback',
        dataField: 'netRakeBack',
        footer: footerSumCalculator(),
      },
      {
        text: 'Commissions',
        dataField: 'commissions',
        sort: true,
        footer: footerSumCalculator(),
      },
      {
        text: 'Earnings',
        dataField: 'earnings',
        sort: true,
        footer: footerSumCalculator(),
      },
      {
        text: 'Payments',
        dataField: 'payments',
        sort: true,
        footer: footerSumCalculator(),
      },*/
      {
        text: 'Balance',
        dataField: 'balance',
        sort: true,
      },
      {
        text: 'Created on',
        dataField: 'createdDate',
        sort: true,
        formatter: DateCell,
      },
      {
        text: 'Last login',
        dataField: 'lastLogin',
      },
    ],
    userFilter: [
      { field: '"firstName"', fieldType: 'text', fieldLabel: 'First name' },
      { field: '"lastName"', fieldType: 'text', fieldLabel: 'Last name' },
      { field: 'email', fieldType: 'text', fieldLabel: 'Email' },
      { field: '"createdDate"', fieldType: 'date', fieldLabel: 'Created date' },
      { field: 'balance', fieldType: 'range', fieldLabel: 'Balance', options: { min: 0, max: 1000 } },
      {
        field: '"user"."parentId"',
        fieldType: 'lazydropdown',
        fieldLabel: 'Referred by',
        options: {
          resource: {
            url: '/lookups/users',
            value: 'id',
            label: 'name',
          },
        },
      },
    ],
    defaultFilter: { role: 'user' },
    form: {
      fields: [
        { name: 'h6', label: 'Basic information', type: 'heading' },
        { name: 'email', label: 'Email', type: 'text', class: 'col-lg-6', required: true },
        { name: 'firstName', label: 'First Name', type: 'text', class: 'col-lg-6', required: true },
        { name: 'lastName', label: 'Last Name', type: 'text', class: 'col-lg-6', required: true },
        { name: 'password', label: 'Password', type: 'text', class: 'col-lg-6', notEditable: true, required: true },
        //{ name: 'role', label: 'Role', type: 'dropdown', options: UserRolesLookup, class: 'col-lg-6' },
        //{ name: 'tag', label: 'Tag', type: 'dropdown', options: UserCategoryLookup, class: 'col-lg-6' },
        { name: 'h6', label: 'Referral system', type: 'heading' },
        {
          name: 'parentId',
          label: 'Referred by',
          type: 'lazydropdown',
          class: 'col-lg-6',
          options: {
            resource: {
              url: '/lookups/users',
              value: 'id',
              label: 'name',
            },
          },
        },
        { name: 'referral_commission', label: 'Referral commission', type: 'number', class: 'col-lg-6' },

        { name: 'h6', label: 'Additional information', type: 'heading' },
        {
          name: 'paymentMethod',
          label: 'Edit Payment Methods',
          type: 'dropdown',
          class: 'col-lg-6',
          options: {
            options: [
              { value: 'visa', label: 'Visa' },
              { value: 'masterCard', label: 'Master Card' },
              { value: 'paypal', label: 'PayPal' },
            ],
          },
        },
        {
          name: 'billing',
          label: 'Edit Billing',
          type: 'dropdown',
          class: 'col-lg-6',
          options: {
            options: [
              { value: 'option1', label: 'Option 1' },
              { value: 'option2', label: 'Option 2' },
              { value: 'option3', label: 'Option 3' },
            ],
          },
        },
      ],
    },
    createActions: [],
    tableActions: [ExportTable],
    editActions: [LoginAsAction, ViewPokerDealsAction, ViewEarningsAction],
    rowActions: [
      ViewPokerDealsCell,
      ViewEarningsCell,
      ViewPaymentsCell,
      ViewPaymentRequestsCell,
      ViewReferralReportCell,
    ],
    breadcrumbsData: {
      breadcrumbs: [{ title: 'Users', link: '/admin/users' }],
      resolvers: {
        title: (result) => result.name,
        link: (result) => `/admin/users/${result.id}/edit`,
        entity: 'user',
      },
    },
  };

  return <CrudContainer title="Users" params={params} />;
};

export default MainInner;
