import CrudContainer from '@pdeals/next/components/Crud/CrudContainer';
import { ICrud } from '@pdeals/next/components/Crud/ICrud';

import { ExportTable } from '@pdeals/next/components/common/Actions';
import { BooleanCell, HTMLCell, DateCell } from '@pdeals/next/components/Crud/CrudList/Cells';
import { tableKeys } from '@pdeals/next/variables/constants';

type Props = {};

const MainInner: React.FunctionComponent<Props> = ({}) => {
  const params: ICrud = {
    apiUrlPrefix: 'snippet',
    uiUrlPrefix: '/admin/snippets',
    title: 'Тексты',
    tableKey: tableKeys.snippets,
    options: {
      isCreatable: true,
      isEditable: true,
      isDeletable: true,
    },
    listColumns: [
      {
        text: 'code',
        dataField: 'code',
        sort: true,
      },
      {
        text: 'Created Date',
        dataField: 'createdDate',
        formatter: DateCell,
      },
    ],
    userFilter: [{ field: 'code', fieldType: 'text', fieldLabel: 'Code' }],
    form: {
      fields: [
        { name: 'code', label: 'Code', type: 'text', class: 'col-lg-6', required: true },
        { name: 'content_ua', label: 'Content UA', type: 'html', class: 'col-lg-12', required: false },
        { name: 'content_ru', label: 'Content RU', type: 'html', class: 'col-lg-12', required: false },
        { name: 'content_en', label: 'Content EN', type: 'html', class: 'col-lg-12', required: false },
        //{ name: 'content', label: 'Content', type: 'html', class: 'col-lg-12', canBeTranslated: true, required: true, },
      ],
    },
    createActions: [],
    tableActions: [],
    editActions: [],
    rowActions: [],
    translatableEntity: false,
    breadcrumbsData: {
      breadcrumbs: [{ title: 'Тексты', link: '/admin/snippets' }],
      resolvers: {
        title: (result) => result.id,
        link: (result) => `/admin/snippets/${result.id}/edit`,
        entity: 'snippet',
      },
    },
  };

  return <CrudContainer title="Snippets" params={params} />;
};

export default MainInner;
