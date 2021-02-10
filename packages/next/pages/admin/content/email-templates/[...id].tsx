import CrudContainer from '@pdeals/next/components/Crud/CrudContainer';
import { ICrud } from '@pdeals/next/components/Crud/ICrud';

import {ExportTable } from '@pdeals/next/components/common/Actions';
import { BooleanCell, HTMLCell, DateCell } from '@pdeals/next/components/Crud/CrudList/Cells';
import { tableKeys } from '@pdeals/next/variables/constants';

type Props = {};

const MainInner: React.FunctionComponent<Props> = ({}) => {
  const params: ICrud = {
    apiUrlPrefix: 'email_templates',
    uiUrlPrefix: '/admin/content/email-templates',
    title: 'Email templates',
    tableKey: tableKeys.email_templates,
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
        text: 'Type',
        dataField: 'type',
        sort: true,
        editable: true,
      },
      {
        text: 'Subject',
        dataField: 'subject',
        sort: true,
        editable: true,
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
        { name: 'type', label: 'Type', type: 'text', class: 'col-lg-12', canBeTranslated: true, required: true, notEditable: true },
        { name: 'subject', label: 'Subject', type: 'text', class: 'col-lg-6', canBeTranslated: true, required: true, },
        { name: 'content', label: 'Content', type: 'html', class: 'col-lg-12', canBeTranslated: true, required: true, },
      ],
    },
    createActions: [],
    tableActions: [],
    editActions: [],
    rowActions: [],
    translatableEntity: true,
    breadcrumbsData: {
      breadcrumbs: [
        { title: 'Email templates', link: '/admin/content/email-templates' },
      ],
      resolvers: {
        title: (result) => result.id,
        link: (result) => `/admin/content/email-templates/${result.id}/edit`,
        entity: 'email_templates',
      },
    },
  };

  return <CrudContainer title="Email templates" params={params} />;
};

export default MainInner;
