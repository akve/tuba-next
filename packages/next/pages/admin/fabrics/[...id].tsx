import CrudContainer from '@pdeals/next/components/Crud/CrudContainer';
import { ICrud } from '@pdeals/next/components/Crud/ICrud';

import { ExportTable } from '@pdeals/next/components/common/Actions';
import { BooleanCell, HTMLCell, DateCell } from '@pdeals/next/components/Crud/CrudList/Cells';
import { tableKeys } from '@pdeals/next/variables/constants';

type Props = {};

const MainInner: React.FunctionComponent<Props> = ({}) => {
  const params: ICrud = {
    apiUrlPrefix: 'fabric',
    uiUrlPrefix: '/admin/fabrics',
    title: 'Ткани',
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
        text: 'Name',
        dataField: 'name',
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

        {
          name: 'description',
          label: 'Description',
          type: 'html',
          class: 'col-lg-12',
          canBeTranslated: true,
          required: false,
        },
      ],
    },
    createActions: [],
    tableActions: [],
    editActions: [],
    rowActions: [],
    translatableEntity: false,
    breadcrumbsData: {
      breadcrumbs: [{ title: 'Ткани', link: '/admin/fabrics' }],
      resolvers: {
        title: (result) => result.id,
        link: (result) => `/admin/fabrics/${result.id}/edit`,
        entity: 'color',
      },
    },
  };

  return <CrudContainer title="Email templates" params={params} />;
};

export default MainInner;
