import CrudContainer from '@pdeals/next/components/Crud/CrudContainer';
import { ICrud } from '@pdeals/next/components/Crud/ICrud';

import { ExportTable } from '@pdeals/next/components/common/Actions';
import { BooleanCell, HTMLCell, DateCell } from '@pdeals/next/components/Crud/CrudList/Cells';
import { tableKeys } from '@pdeals/next/variables/constants';

type Props = {};

const MainInner: React.FunctionComponent<Props> = ({}) => {
  const params: ICrud = {
    apiUrlPrefix: 'category',
    uiUrlPrefix: '/admin/categories',
    overrideListUrlPrefix: '/open/categories',
    title: 'Категории',
    tableKey: tableKeys.categories,
    options: {
      isCreatable: true,
      isEditable: true,
      isDeletable: true,
    },
    listColumns: [
      {
        text: 'ID',
        dataField: 'id',
        sort: true,
      },
      {
        text: 'Sorter',
        dataField: 'sorter',
        sort: true,
      },
      {
        text: 'Code',
        dataField: 'code',
        sort: true,
      },
      {
        text: 'Parent',
        dataField: 'parentname',
        sort: true,
      },
      {
        text: 'Name',
        dataField: 'name',
        sort: true,
      },
      {
        text: 'invisible',
        dataField: 'invisible',
        sort: true,
      },
      {
        text: 'Created Date',
        dataField: 'createdDate',
        formatter: DateCell,
      },
    ],
    userFilter: [
      { field: '"category".name', fieldType: 'text', fieldLabel: 'Name' },
      { field: '"parentcat".name', fieldType: 'text', fieldLabel: 'Parent' },
      { field: '"category".code', fieldType: 'text', fieldLabel: 'Code' },
    ],
    form: {
      fields: [
        { name: 'code', label: 'Code', type: 'text', class: 'col-lg-6', required: true, notEditable: false },
        { name: 'name', label: 'Name', type: 'text', class: 'col-lg-6', required: true },
        {
          name: 'parent',
          label: 'Parent category',
          type: 'lazydropdown',
          class: 'col-lg-3',
          options: {
            resource: {
              url: '/lookups/categories',
              value: 'id',
              label: 'name',
            },
          },
        },
        { name: 'sorter', label: 'Sort', type: 'number', class: 'col-lg-3' },
        { name: 'invisible', label: 'Invisible', type: 'checkbox', class: 'col-lg-3' },
        { name: 'parent_not_clickable', label: 'Not clickable', type: 'checkbox', class: 'col-lg-3' },
        { name: 'image', label: 'Image', type: 'text', class: 'col-lg-12', required: false },
        //{ name: 'content', label: 'Content', type: 'html', class: 'col-lg-12', canBeTranslated: true, required: true, },
      ],
    },
    createActions: [],
    tableActions: [],
    editActions: [],
    rowActions: [],
    translatableEntity: false,
    breadcrumbsData: {
      breadcrumbs: [{ title: 'Категории', link: '/admin/categories' }],
      resolvers: {
        title: (result) => result.id,
        link: (result) => `/admin/categories/${result.id}/edit`,
        entity: 'category',
      },
    },
  };

  return <CrudContainer title="Email templates" params={params} />;
};

export default MainInner;
