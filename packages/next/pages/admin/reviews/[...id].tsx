import CrudContainer from '@pdeals/next/components/Crud/CrudContainer';
import { ICrud } from '@pdeals/next/components/Crud/ICrud';

import { ExportTable } from '@pdeals/next/components/common/Actions';
import { BooleanCell, HTMLCell, DateCell } from '@pdeals/next/components/Crud/CrudList/Cells';
import { tableKeys } from '@pdeals/next/variables/constants';

type Props = {};

const MainInner: React.FunctionComponent<Props> = ({}) => {
  const params: ICrud = {
    apiUrlPrefix: 'review',
    uiUrlPrefix: '/admin/reviews',
    title: 'Отзывы',
    tableKey: tableKeys.reviews,
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
        dataField: 'username',
        sort: true,
      },
      {
        text: 'Score',
        dataField: 'score',
        sort: true,
      },
      {
        text: 'Review Date',
        dataField: 'score_date',
        formatter: DateCell,
      },
      {
        text: 'Created Date',
        dataField: 'createdDate',
        formatter: DateCell,
      },
    ],
    userFilter: [{ field: 'username', fieldType: 'text', fieldLabel: 'Search' }],
    form: {
      fields: [
        { name: 'username', label: 'From user', type: 'text', class: 'col-lg-6', required: true, notEditable: false },
        { name: 'score_date', label: 'Date', type: 'date', class: 'col-lg-6', required: false, notEditable: false },
        {
          name: 'product',
          label: 'Product',
          type: 'lazydropdown',
          class: 'col-lg-6',
          options: {
            resource: {
              url: '/lookups/products',
              value: 'id',
              label: 'name',
            },
          },
        },
        {
          name: 'userlink',
          label: 'Link to profile',
          type: 'text',
          class: 'col-lg-6',
          required: true,
          notEditable: false,
        },
        {
          name: 'reviewlink',
          label: 'Link to review',
          type: 'text',
          class: 'col-lg-6',
          required: true,
          notEditable: false,
        },
        {
          name: 'data.products',
          label: 'Доп.товары',
          type: 'smartlist',
          class: 'col-lg-6',
          fieldSpecificParams: {
            initialData: {
              product: '',
              name: '',
            },
            fields: [
              {
                name: 'product',
                label: '',
                type: 'lazydropdown',
                class: 'col-12',
                options: {
                  resource: {
                    url: '/lookups/products',
                    value: 'id',
                    label: 'name',
                  },
                  alsoSetLabelTo: 'name',
                },
              },
              { name: 'name', label: 'Name', type: 'text', class: 'd-none', required: true },
            ],
            columns: [{ name: 'name', label: 'Продукт' }],
          },
        },
        { name: 'score', label: 'Score', type: 'number', class: 'col-lg-6', required: true, defaultValue: 5 },
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
      breadcrumbs: [{ title: 'Отзывы', link: '/admin/reviews' }],
      resolvers: {
        title: (result) => result.id,
        link: (result) => `/admin/reviews/${result.id}/edit`,
        entity: 'review',
      },
    },
  };

  return <CrudContainer title="Email templates" params={params} />;
};

export default MainInner;
