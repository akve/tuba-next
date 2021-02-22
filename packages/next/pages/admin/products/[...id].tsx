import CrudContainer from '@pdeals/next/components/Crud/CrudContainer';
import { ICrud } from '@pdeals/next/components/Crud/ICrud';

import { ExportTable } from '@pdeals/next/components/common/Actions';
import { BooleanCell, HTMLCell, DateCell } from '@pdeals/next/components/Crud/CrudList/Cells';
import { tableKeys } from '@pdeals/next/variables/constants';

type Props = {};

const MainInner: React.FunctionComponent<Props> = ({}) => {
  const params: ICrud = {
    apiUrlPrefix: 'product',
    uiUrlPrefix: '/admin/products',
    title: 'Товары',
    tableKey: tableKeys.products,
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
    userFilter: [{ field: 'name', fieldType: 'text', fieldLabel: 'Имя' }],
    form: {
      fields: [
        { name: 'code', label: 'Code', type: 'text', class: 'col-lg-6', required: true, notEditable: false },
        { name: 'name', label: 'Name', type: 'text', class: 'col-lg-6', required: true },
        { name: 'price', label: 'Price', type: 'number', class: 'col-lg-6', required: true },
        {
          name: 'data.categories',
          label: 'Категории',
          type: 'smartlist',
          class: 'col-lg-12',
          fieldSpecificParams: {
            initialData: {
              category: '',
              name: '',
            },
            fields: [
              {
                name: 'category',
                label: 'Category',
                type: 'lazydropdown',
                class: 'col-lg-6',
                options: {
                  resource: {
                    url: '/lookups/categories',
                    value: 'id',
                    label: 'name',
                  },
                  alsoSetLabelTo: 'name',
                },
              },
              { name: 'name', label: 'Name', type: 'text', class: 'd-none', required: true },
            ],
            columns: [{ name: 'name', label: 'Категория' }],
          },
        },

        { name: 'description', label: 'Описание', type: 'html', class: 'col-lg-12', required: true },
      ],
    },
    createActions: [],
    tableActions: [],
    editActions: [],
    rowActions: [],
    translatableEntity: false,
    breadcrumbsData: {
      breadcrumbs: [{ title: 'Товары', link: '/admin/products' }],
      resolvers: {
        title: (result) => result.id,
        link: (result) => `/admin/products/${result.id}/edit`,
        entity: 'color',
      },
    },
  };

  return <CrudContainer title="Товары" params={params} />;
};

export default MainInner;
