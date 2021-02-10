import CrudContainer from '@pdeals/next/components/Crud/CrudContainer';
import { ICrud } from '@pdeals/next/components/Crud/ICrud';

import { ExportTable, Disabled } from '@pdeals/next/components/common/Actions';
import { DateCell, DisableCell, FullNameCell } from '@pdeals/next/components/Crud/CrudList/Cells';
import { tableKeys } from '@pdeals/next/variables/constants';
import { LoginAsAction } from '@pdeals/next/modules/admin/User/UserViewActions';

type Props = {};

const MainInner: React.FunctionComponent<Props> = ({}) => {
  const params: ICrud = {
    apiUrlPrefix: 'user',
    uiUrlPrefix: '/admin/settings/admins',
    title: 'Admin users',
    tableKey: tableKeys.admins,
    options: {
      isEditable: true,
      isCreatable: true,
      formPreSaveFunction: (id: number, data: any) => {
        data.role = 'admin';
        return data;
      },
    },
    listColumns: [
      {
        text: 'ID',
        dataField: 'id',
        sort: true,
      },
      {
        text: 'Created date',
        dataField: 'createdDate',
        formatter: DateCell,
      },
      {
        text: 'Disabled',
        dataField: 'is_disabled',
      },
      {
        text: 'Last login',
        dataField: 'lastLogin',
        formatter: DateCell,
      },
      {
        text: 'Email',
        dataField: 'email',
        sort: true,
      },
      {
        text: 'Name',
        dataField: 'firstName',
        formatter: FullNameCell,
      },
    ],
    userFilter: [{ field: 'search', fieldType: 'text', fieldLabel: 'Search' }],
    defaultFilter: { role: 'admin' },
    form: {
      fields: [
        { name: 'h6', label: 'Basic information', type: 'heading' },
        { name: 'email', label: 'Email', type: 'text', class: 'col-lg-6' },
        { name: 'firstName', label: 'First Name', type: 'text', class: 'col-lg-6' },
        { name: 'lastName', label: 'Last Name', type: 'text', class: 'col-lg-6' },
        { name: 'password', label: 'Password', type: 'text', class: 'col-lg-6', notEditable: true },
        { name: 'role', label: '', type: 'text', class: 'col-lg-6 d-none', defaultValue: 'admin', notEditable: true },
        {
          name: 'attachments',
          label: 'Attachments',
          type: 'attachments',
          class: 'col-lg-12',
          fieldSpecificParams: { multiple: true, entityName: 'user' },
        },
      ],
    },
    createActions: [],
    tableActions: [ExportTable],
    editActions: [LoginAsAction, Disabled],
    rowActions: [DisableCell],
    breadcrumbsData: {
      breadcrumbs: [{ title: 'Admin users', link: '/admin/settings/admins' }],
      resolvers: {
        title: (result) => result.name,
        link: (result) => `/admin/settings/admins${result.id}/edit`,
        entity: 'user',
      },
    },
  };

  return <CrudContainer title="Admin users" params={params} />;
};

export default MainInner;
