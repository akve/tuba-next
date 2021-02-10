import CrudContainer from '@pdeals/next/components/Crud/CrudContainer';
import { ICrud } from '@pdeals/next/components/Crud/ICrud';

import {ExportTable } from '@pdeals/next/components/common/Actions';
import { BooleanCell, HTMLCell, DateCell } from '@pdeals/next/components/Crud/CrudList/Cells';
import { tableKeys } from '@pdeals/next/variables/constants';

type Props = {};

const MainInner: React.FunctionComponent<Props> = ({}) => {
  const params: ICrud = {
    apiUrlPrefix: 'news',
    uiUrlPrefix: '/admin/content/news',
    title: 'News',
    tableKey: tableKeys.news,
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
        text: 'Content',
        dataField: 'content',
        sort: true,
        editable: true,
        formatter: HTMLCell,
      },
      {
        text: 'Tag',
        dataField: 'tag',
        editable: true,
      },
      {
        text: 'Date',
        dataField: 'date',
        editable: true,
        formatter: DateCell,
      },
      {
        text: 'Enbabled',
        dataField: 'enabled',
        sort: true,
        formatter: BooleanCell,
      },
      {
        text: 'Created Date',
        dataField: 'createdDate',
        formatter: DateCell,
      },
    ],
    userFilter: [
      { field: 'search', fieldType: 'text', fieldLabel: 'Search' },
      { field: 'date', fieldType: 'date', fieldLabel: 'Date' },
      { field: 'tag', fieldType: 'text', fieldLabel: 'Tags' },
    ],
    form: {
      fields: [
        { name: 'h6', label: 'Basic information', type: 'heading' },
        { name: 'title', label: 'Title', type: 'text', class: 'col-lg-12', canBeTranslated: true, required: true, },
        { name: 'content', label: 'Content', type: 'html', class: 'col-lg-12', canBeTranslated: true },
        { name: 'tag', label: 'Tag', type: 'text', class: 'col-lg-6', canBeTranslated: true },
        { name: 'date', label: 'Date', type: 'date', class: 'col-lg-6', required: true, },
      ],
    },
    createActions: [],
    tableActions: [ExportTable],
    editActions: [],
    rowActions: [],
    translatableEntity: true,
    breadcrumbsData: {
      breadcrumbs: [
        { title: 'News', link: '/admin/content/news' },
      ],
      resolvers: {
        title: (result) => result.name,
        link: (result) => `/admin/content/news/${result.id}/edit`,
        entity: 'news',
      },
    },
  };

  return <CrudContainer title="News" params={params} />;
};

export default MainInner;
