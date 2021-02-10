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

const TranslationsMainInner: React.FunctionComponent<Props> = ({}) => {
  const router = useRouter();
  const uiUrlPrefix = '/admin/settings/translations';
  const params: ICrud = {
    apiUrlPrefix: 'translation',
    uiUrlPrefix,
    title: 'Translations',
    translatableEntity: true,
    tableKey: tableKeys.translations,
    options: {
      isCreatable: true,
      isEditable: true,
    },
    listColumns: [
      {
        text: 'Key',
        dataField: 'code',
      },
      {
        text: 'English',
        dataField: 'en',
      },
      {
        text: 'Context',
        dataField: 'context',
      },
    ],
    form: {
      fields: [
        { name: 'code', label: 'Key', type: 'text', class: 'col-lg-6' },
        { name: 'context', label: 'Context', type: 'text', class: 'col-lg-6' },
        { name: 'en', label: 'English', type: 'text', class: 'col-lg-12' },
        { name: 'translation', label: 'Translation', type: 'text', class: 'col-lg-12', canBeTranslated: true },
      ],
    },
    rowActions: [],
    editActions: [],
    breadcrumbsData: {
      breadcrumbs: [
        { title: 'Translations', link: '/admin/content/translations' },
      ],
      resolvers: {
        title: (result) => result.id,
        link: (result) => `/admin/content/translations/${result.id}/edit`,
        entity: 'translation',
      },
    },
  };
  return <CrudContainer title="Translations" params={params} />;
};

export default TranslationsMainInner;
