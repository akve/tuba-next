import CrudContainer from '@pdeals/next/components/Crud/CrudContainer';
import { ICrud } from '@pdeals/next/components/Crud/ICrud';

import { ExportTable } from '@pdeals/next/components/common/Actions';
import { BooleanCell, HTMLCell, DateCell } from '@pdeals/next/components/Crud/CrudList/Cells';
import { tableKeys } from '@pdeals/next/variables/constants';

type Props = {};

const MainInner: React.FunctionComponent<Props> = ({}) => {
  const params: ICrud = {
    apiUrlPrefix: 'color',
    uiUrlPrefix: '/admin/colors',
    overrideListUrlPrefix: '/open/colors',
    title: 'Цвета',
    tableKey: tableKeys.colors,
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
        text: 'Fabric',
        dataField: 'fabricname',
        sort: true,
      },
      {
        text: 'Name',
        dataField: 'name',
        sort: true,
      },
      {
        text: 'Invisible?',
        dataField: 'invisible',
        sort: true,
      },
      {
        text: 'Created Date',
        dataField: 'createdDate',
        formatter: DateCell,
      },
    ],
    userFilter: [{ field: 'name', fieldType: 'text', fieldLabel: 'Search' }],
    form: {
      fields: [
        { name: 'code', label: 'Code', type: 'text', class: 'col-lg-6', required: true, notEditable: false },
        { name: 'name', label: 'Name', type: 'text', class: 'col-lg-6', required: true },
        { name: 'invisible', label: 'Invisible?', type: 'checkbox', class: 'col-lg-6'},
        {
          name: 'fabric',
          label: 'Fabric',
          type: 'lazydropdown',
          class: 'col-lg-6',
          options: {
            resource: {
              url: '/lookups/fabrics',
              value: 'id',
              label: 'name',
            },
          },
        },
        { name: 'image', label: 'Image', type: 'text', class: 'col-lg-12', required: true },
        //{ name: 'content', label: 'Content', type: 'html', class: 'col-lg-12', canBeTranslated: true, required: true, },
      ],
    },
    createActions: [],
    tableActions: [],
    editActions: [],
    rowActions: [],
    translatableEntity: false,
    breadcrumbsData: {
      breadcrumbs: [{ title: 'Цвета', link: '/admin/colors' }],
      resolvers: {
        title: (result) => result.id,
        link: (result) => `/admin/colors/${result.id}/edit`,
        entity: 'color',
      },
    },
  };

  return <CrudContainer title="Email templates" params={params} />;
};

export default MainInner;
