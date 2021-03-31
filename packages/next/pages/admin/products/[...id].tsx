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
        text: 'Код',
        dataField: 'code',
        sort: true,
      },
      {
        text: 'Created Date',
        dataField: 'createdDate',
        formatter: DateCell,
      },
    ],
    userFilter: [
      { field: 'name', fieldType: 'text', fieldLabel: 'Имя' },
      { field: 'code', fieldType: 'text', fieldLabel: 'Код' },
    ],
    form: {
      fields: [
        { name: 'code', label: 'Code', type: 'text', class: 'col-lg-6', required: true, notEditable: false },
        { name: 'name', label: 'Name', type: 'text', class: 'col-lg-6', required: true },
        { name: 'price', label: 'Price', type: 'number', class: 'col-lg-6', required: true },
        { name: 'invisible', label: 'Invisible', type: 'checkbox', class: 'col-lg-3' },
        {
          name: 'data.collections',
          label: 'Коллекция',
          type: 'smartlist',
          class: 'col-lg-6',
          fieldSpecificParams: {
            initialData: {
              collection: '',
              name: '',
            },
            fields: [
              {
                name: 'collection',
                label: '',
                type: 'lazydropdown',
                class: 'col-12',
                options: {
                  resource: {
                    url: '/lookups/collections',
                    value: 'id',
                    label: 'name',
                  },
                  alsoSetLabelTo: 'name',
                },
              },
              { name: 'name', label: 'Name', type: 'text', class: 'd-none', required: true },
            ],
            columns: [{ name: 'name', label: 'Коллекция' }],
          },
        },
        {
          name: 'data.categories',
          label: 'Категории',
          type: 'smartlist',
          class: 'col-lg-6',
          fieldSpecificParams: {
            initialData: {
              category: '',
              name: '',
            },
            fields: [
              {
                name: 'category',
                label: '',
                type: 'lazydropdown',
                class: 'col-12',
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
        {
          name: 'data.colors',
          label: 'Цвета',
          type: 'smartlist',
          class: 'col-lg-6',
          fieldSpecificParams: {
            initialData: {
              color: '',
              name: '',
            },
            fields: [
              {
                name: 'color',
                label: '',
                type: 'lazydropdown',
                class: 'col-12',
                options: {
                  resource: {
                    url: '/lookups/colors',
                    value: 'id',
                    label: 'name',
                  },
                  alsoSetLabelTo: 'name',
                },
              },
              { name: 'name', label: 'Name', type: 'text', class: 'd-none', required: true },
            ],
            columns: [{ name: 'name', label: 'Цвет' }],
          },
        },
        {
          name: 'data.images',
          label: 'Картинки',
          type: 'smartlist',
          class: 'col-lg-6',
          fieldSpecificParams: {
            initialData: {
              image: '',
            },
            fields: [
              {
                name: 'image',
                label: '',
                type: 'text',
                class: 'col-12',
              },
            ],
            columns: [{ name: 'image', label: 'Image', class: 'image-col' }],
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
        entity: 'product',
      },
    },
  };

  return <CrudContainer title="Товары" params={params} />;
};

export default MainInner;
