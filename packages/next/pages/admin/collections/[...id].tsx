import CrudContainer from '@pdeals/next/components/Crud/CrudContainer';
import { ICrud } from '@pdeals/next/components/Crud/ICrud';

import {ExportTable } from '@pdeals/next/components/common/Actions';
import { BooleanCell, HTMLCell, DateCell } from '@pdeals/next/components/Crud/CrudList/Cells';
import { tableKeys } from '@pdeals/next/variables/constants';

type Props = {};

const MainInner: React.FunctionComponent<Props> = ({}) => {
    const params: ICrud = {
        apiUrlPrefix: 'collection',
        uiUrlPrefix: '/admin/collections',
        title: 'Коллекции',
        tableKey: tableKeys.colors,
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
                dataField: 'name',
                sort: true,
            },
            {
                text: 'Created Date',
                dataField: 'createdDate',
                formatter: DateCell,
            },
        ],
        userFilter: [
            { field: 'name', fieldType: 'text', fieldLabel: 'Search' },
        ],
        form: {
            fields: [
                { name: 'code', label: 'Code', type: 'text', class: 'col-lg-6', required: true, notEditable: false },
                { name: 'name', label: 'Name', type: 'text', class: 'col-lg-6', required: true, },
                { name: 'image', label: 'Image', type: 'text', class: 'col-lg-12', required: false, },
                //{ name: 'content', label: 'Content', type: 'html', class: 'col-lg-12', canBeTranslated: true, required: true, },
            ],
        },
        createActions: [],
        tableActions: [],
        editActions: [],
        rowActions: [],
        translatableEntity: false,
        breadcrumbsData: {
            breadcrumbs: [
                { title: 'Коллекции', link: '/admin/collections' },
            ],
            resolvers: {
                title: (result) => result.id,
                link: (result) => `/admin/collections/${result.id}/edit`,
                entity: 'collection',
            },
        },
    };

    return <CrudContainer title="Email templates" params={params} />;
};

export default MainInner;
