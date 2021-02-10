import CrudContainer from '@pdeals/next/components/Crud/CrudContainer';
import { ICrud } from '@pdeals/next/components/Crud/ICrud';
import { tableKeys } from '@pdeals/next/variables/constants';

import {
  ExportTable,
  Confirmation,
  CloneItem,
} from '@pdeals/next/components/common/Actions';
import {
  BooleanCell,
  ConfirmationCell,
  DateTimeCell,
} from '@pdeals/next/components/Crud/CrudList/Cells';

type Props = {};

const MainInner: React.FunctionComponent<Props> = ({}) => {
  const params: ICrud = {
    apiUrlPrefix: 'promotions',
    uiUrlPrefix: '/admin/content/promotions',
    title: 'Promotions',
    tableKey: tableKeys.promotions,
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
        text: 'Title',
        dataField: 'title',
        sort: true,
        editable: true,
      },
      {
        text: 'Brand',
        dataField: 'brand',
        sort: true,
        editable: true,
      },
      {
        text: 'Subtitle',
        dataField: 'subTitle',
        editable: true,
      },
      {
        text: 'Enbabled',
        dataField: 'enabled',
        sort: true,
        formatter: BooleanCell,
      },
      {
        text: 'Confirmed',
        dataField: 'confirmed',
        sort: true,
        formatter: BooleanCell,
      },
      {
        text: 'Start Date',
        dataField: 'startDate',
        editable: true,
        formatter: DateTimeCell,
      },
      {
        text: 'Finish Date',
        dataField: 'finishDate',
        editable: true,
        formatter: DateTimeCell,
      },
      {
        text: 'Created Date',
        sort: true,
        dataField: 'createdDate',
        formatter: DateTimeCell,
      },
    ],
    userFilter: [
      { field: 'search', fieldType: 'text', fieldLabel: 'Search' },
    ],
    form: {
      fields: [
        { name: 'h6', label: 'Basic information', type: 'heading' },
        { name: 'title', label: 'Title', type: 'text', class: 'col-lg-6', canBeTranslated: true, required: true, },
        { name: 'brand', label: 'Brand', type: 'text', class: 'col-lg-6', canBeTranslated: true },
        { name: 'subTitle', label: 'Subtitle', type: 'text', class: 'col-lg-6', canBeTranslated: true },
        { name: 'startDate', label: 'Start Date', type: 'date', class: 'col-lg-6', required: true, },
        { name: 'finishDate', label: 'Finish Date', type: 'date', class: 'col-lg-6', required: true, },
      ],
    },
    createActions: [],
    tableActions: [ExportTable],
    editActions: [CloneItem, Confirmation],
    rowActions: [ConfirmationCell],
    translatableEntity: true,
    breadcrumbsData: {
      breadcrumbs: [
        { title: 'Promotions', link: '/admin/content/promotions' },
      ],
      resolvers: {
        title: (result) => result.name,
        link: (result) => `/admin/content/promotions/${result.id}/edit`,
        entity: 'promotions',
      },
    },
  };

  return <CrudContainer title="Promotions" params={params} />;
};

export default MainInner;
