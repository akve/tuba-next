import CrudContainer from '@pdeals/next/components/Crud/CrudContainer';
import { ICrud } from '@pdeals/next/components/Crud/ICrud';

import { DisableCell, URLCell } from '@pdeals/next/components/Crud/CrudList/Cells';
import { Disabled } from '@pdeals/next/components/common/Actions';
import { footerSumCalculator } from '@pdeals/next/utils/helpers';
import { tableKeys } from '@pdeals/next/variables/constants';

type Props = {};

const RoomsMainInner: React.FunctionComponent<Props> = ({}) => {
  const uiUrlPrefix = '/admin/content/public-rooms';
  const params: ICrud = {
    apiUrlPrefix: 'public_room',
    uiUrlPrefix,
    title: 'Public Rooms',
    tableKey: tableKeys.public_rooms,
    options: {
      isCreatable: true,
      isEditable: true,
    },
    translatableEntity: true,
    listColumns: [
      {
        text: 'ID',
        dataField: 'id',
      },
      {
        text: 'Name',
        dataField: 'name',
      },
      {
        text: 'Disabled',
        dataField: 'is_disabled',
      },
      {
        text: 'Network',
        dataField: 'network',
      },
      {
        text: 'Room',
        dataField: 'room',
      },
      {
        text: 'Standard Rakeback Deal',
        dataField: 'deal',
      },
      /*{
        text: 'PD Rakeback Deal',
        dataField: 'parent_deal',
        footer: footerSumCalculator(),
      },*/
      {
        text: 'Review',
        dataField: 'review',
      },
      /*{
        text: 'GalleryBonus',
        dataField: 'gallery_bonus',
      },*/
      {
        text: 'URL Link',
        dataField: 'url_link',
        formatter: URLCell,
      },
      {
        text: 'APP Link',
        dataField: 'app_link',
        formatter: URLCell,
      },
    ],
    userFilter: [
      { field: 'search', fieldType: 'text', fieldLabel: 'Search' },
      { field: 'date', fieldType: 'date', fieldLabel: 'Date' },
      { field: 'rakeBackDeal', fieldType: 'range', fieldLabel: 'PD Rakeback Deal ' },
    ],
    form: {
      fields: [
        { name: 'name', label: 'Name', type: 'text', class: 'col-lg-6', canBeTranslated: true, required: true },
        // { name: 'gallery_bonus', label: 'Gallery Bonus', type: 'text', class: 'col-lg-6', canBeTranslated: false },
        { name: 'url_link', label: 'URL Link', type: 'text', class: 'col-lg-6', canBeTranslated: false },
        { name: 'app_link', label: 'APP Link', type: 'text', class: 'col-lg-6', canBeTranslated: false },
        { name: 'network', label: 'Network', type: 'text', class: 'col-lg-6', canBeTranslated: false },
        {
          name: 'deal',
          label: 'Standard Rakeback Deal',
          type: 'number',
          class: 'col-lg-6',
          canBeTranslated: false,
          required: true,
        },
        /*{
          name: 'parent_deal',
          label: 'PD Rakeback Deal',
          type: 'number',
          class: 'col-lg-6',
          canBeTranslated: false,
          required: true,
        },*/
        // { name: 'review', label: 'Review', type: 'text', class: 'col-lg-6', canBeTranslated: false },
        {
          name: 'room',
          label: 'Linked to room',
          type: 'lazydropdown',
          class: 'col-lg-6',
          options: {
            resource: {
              url: '/lookups/rooms',
              value: 'id',
              label: 'name',
            },
          },
        },
        { name: 'description', label: 'Description', type: 'html', class: 'col-lg-12', canBeTranslated: true },

        // { name: 'room', label: 'Room', type: 'text', class: 'col-lg-6', canBeTranslated: false },
      ],
    },
    rowActions: [DisableCell],
    tableActions: [],
    editActions: [Disabled],
    breadcrumbsData: {
      breadcrumbs: [{ title: 'Poker rooms', link: '/admin/content/public-rooms' }],
      resolvers: {
        title: (result) => result.name,
        link: (result) => `/admin/content/public-rooms/${result.id}/edit`,
        entity: 'public_room',
      },
    },
  };
  return <CrudContainer title="Public Rooms" params={params} />;
};

export default RoomsMainInner;
