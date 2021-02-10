import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Row } from 'reactstrap';
import AdminFullLayout from '@pdeals/next/components/layouts/AdminFullLayout';
import CrudContainer from '@pdeals/next/components/Crud/CrudContainer';
import { ICrud, IExternalComponent, IExternalComponentProps } from '@pdeals/next/components/Crud/ICrud';
import { client } from '@pdeals/next/lib/api/api-client';
import { addNotification } from '@pdeals/next/utils/notifications';
import { Button } from 'reactstrap';
import CrawlerSourceTypes from '@pdeals/models/lookups/CrawlerSourceTypes';
import { tableKeys } from '@pdeals/next/variables/constants';

type Props = {};

const LanguagesMainInner: React.FunctionComponent<Props> = ({}) => {
  const router = useRouter();
  const uiUrlPrefix = '/admin/settings/languages';
  const params: ICrud = {
    apiUrlPrefix: 'language',
    uiUrlPrefix,
    title: 'Languages',
    tableKey: tableKeys.languages,
    options: {
      isCreatable: true,
      isEditable: true,
      isDeletable: true,
    },
    listColumns: [
      {
        text: 'Name',
        dataField: 'name',
      },
      {
        text: 'Code',
        dataField: 'code',
      },
    ],
    form: {
      fields: [
        { name: 'code', label: 'Code', type: 'text', class: 'col-lg-6' },
        { name: 'name', label: 'Readable name', type: 'text', class: 'col-lg-6' },
        { name: 'is_enabled_frontend', label: 'Enabled on user frontend?', type: 'checkbox', class: 'col-lg-6' },
        { name: 'is_enabled_public', label: 'Enabled on public?', type: 'checkbox', class: 'col-lg-6' },
      ],
    },
    rowActions: [],
    editActions: [],
    breadcrumbsData: {
      breadcrumbs: [{ title: 'Languages', link: '/admin/settings/languages' }],
      resolvers: {
        title: result => result.name,
        link: result => `/admin/settings/languages/${result.id}/edit`,
        entity: 'language',
      },
    },
  };
  return <CrudContainer title="Languages" params={params} />;
};

export default LanguagesMainInner;
