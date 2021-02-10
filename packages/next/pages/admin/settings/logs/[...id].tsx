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

import { ExportTable } from '@pdeals/next/components/common/Actions';
import { tableKeys } from '@pdeals/next/variables/constants';

type Props = {};

const LogsMainInner: React.FunctionComponent<Props> = ({}) => {
    const router = useRouter();
    const uiUrlPrefix = '/admin/settings/logs';
    const params: ICrud = {
        apiUrlPrefix: 'log',
        overrideListUrlPrefix: '/log',
        uiUrlPrefix,
        title: 'Logs',
        tableKey: tableKeys.logs,
        options: {
            isCreatable: false,
            isEditable: false,
            isDeletable: false,
            listDefaultSortField: '"createdDate"',
            listDefaultSortDirection: 'desc'
        },
        listColumns: [
            {
                text: 'Date',
                dataField: 'createdDate',
            },
            {
                text: 'User',
                dataField: 'username',
            },
            {
                text: 'Area',
                dataField: 'area',
            },
            {
                text: 'Action',
                dataField: 'action',
            },
        ],
        form: {
            fields: [
            ],
        },
        userFilter: [
            {
                field: 'u.id',
                fieldType: 'lazydropdown',
                fieldLabel: 'User',
                options: {
                    resource: {
                        url: '/lookups/users',
                        value: 'id',
                        label: 'name',
                    },
                },
            },
            { field: 'createdDate', fieldType: 'date', fieldLabel: 'Date' },
            { field: 'string::area', fieldType: 'lazydropdown',
                fieldLabel: 'Area',
                options: {
                    resource: {
                        url: '/log/areas_lookup',
                        value: 'id',
                        label: 'name',
                    },
                },
            },
        ],
        rowActions: [],
        editActions: [],
        breadcrumbsData: {
            breadcrumbs: [{ title: 'Logs', link: '/admin/settings/logs' }],
            resolvers: {
                title: result => result.id,
                link: result => `/admin/settings/logs/${result.id}/edit`,
                entity: 'log',
            },
        },
    };
    return <CrudContainer title="Logs" params={params} />;
};

export default LogsMainInner;
