import CrudContainer from '@pdeals/next/components/Crud/CrudContainer';
import { ICrud } from '@pdeals/next/components/Crud/ICrud';

import { ExportTable } from '@pdeals/next/components/common/Actions';
import { BooleanCell, HTMLCell, DateCell } from '@pdeals/next/components/Crud/CrudList/Cells';
import { tableKeys } from '@pdeals/next/variables/constants';
import CrudFormWrapper from '@pdeals/next/components/Crud/CrudForm/CrudFormWrapper';

type Props = {
  id: number;
  afterSave: any;
};

const EditProductForm: React.FunctionComponent<Props> = ({ id, afterSave }) => {
  const params: ICrud = {
    apiUrlPrefix: 'product',
    uiUrlPrefix: '',
    title: 'Товар',
    tableKey: tableKeys.products,
    options: {
      disableBack: true,
      isEditable: true,
      formPostSaveFunction: afterSave,
    },
    listColumns: [],
    userFilter: [],
    form: {
      fields: [
        { name: 'code', label: 'Code', type: 'text', class: 'col-lg-6', required: true, notEditable: false },
        { name: 'name', label: 'Name', type: 'text', class: 'col-lg-6', required: true },
        { name: 'price', label: 'Price', type: 'number', class: 'col-lg-6', required: true },
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
  };

  return <CrudFormWrapper params={params} id={id} />;
};

export default EditProductForm;
