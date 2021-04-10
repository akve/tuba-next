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

const EditColorForm: React.FunctionComponent<Props> = ({ id, afterSave }) => {
  const params: ICrud = {
    apiUrlPrefix: 'color',
    uiUrlPrefix: '',
    title: 'Цвет',
    tableKey: tableKeys.colors,
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
  };

  return <CrudFormWrapper params={params} id={id} />;
};

export default EditColorForm;
