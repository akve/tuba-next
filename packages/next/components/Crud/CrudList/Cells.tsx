import { memo } from 'react';
import Link from '@pdeals/next/elements/NextLink';
import format from 'date-fns/format';

import { CrudApi } from '@pdeals/next/lib/api/crud-api';
import { useNotification } from '@pdeals/next/lib/hooks';

export type CellProps = {
  data: any;
  params: any;
  callbacks: { [key: string]: () => void };
};

export const IDCell = (id) => {
  return (
    <Link href={`admin/users/${id}/edit`}>
      <button className="btn btn-link btn-block btn-sm" type="button">
        {id}
      </button>
    </Link>
  );
};

export const FullNameCell = (_, { firstName, user_fName, lastName, user_lName, user_id, id }) => {
  const first_name = firstName || user_fName;
  const last_name = lastName || user_lName;

  return (
    <Link href={`/admin/users/${user_id || id}/edit`}>
      <button className="btn btn-link btn-sm" type="button">
        <span>
          {first_name} {last_name}
        </span>
      </button>
    </Link>
  );
};

export const EditCell = memo(({ data, params }: CellProps) => (
  <Link href={`${params.uiUrlPrefix}/${data.id}/edit`} as={`${params.uiUrlPrefix}/${data.id}/edit`}>
    <button className="btn btn-link btn-block btn-sm" type="button">
      Edit
    </button>
  </Link>
));

export const ViewCell = memo(({ data, params }: CellProps) => (
  <Link href={`${params.uiUrlPrefix}/view/[id]`} as={`${params.uiUrlPrefix}/view/${data.id}`}>
    <button className="btn btn-link btn-block btn-sm" type="button">
      View
    </button>
  </Link>
));

export const DeleteCell = memo(({ data, params, callbacks }: CellProps) => {
  const { notify } = useNotification();

  const handleDelete = async () => {
    try {
      await CrudApi(params).delete(data.id);
      if (callbacks.refetch) callbacks.refetch();
      notify('success', 'Success', 'Item has been removed!');
    } catch (error) {
      notify('danger', error.name, error.message);
    }
  };

  return (
    <button className="btn btn-link btn-block btn-sm" type="button" onClick={handleDelete}>
      Delete
    </button>
  );
});

export const BooleanCell = (value) => <span>{value ? 'Yes' : 'No'}</span>;

export const DateCell = (value) => <span>{value ? format(new Date(value), 'MM/dd/yyyy') : ''}</span>;

export const DateTimeCell = (value) => <span>{value ? format(new Date(value), 'MM/dd/yyyy hh:mm:ss') : ''}</span>;

export const ConfirmationCell = ({ data, params, callbacks }) => {
  const saveItem = async () => {
    try {
      await CrudApi(params).save(data.id, { confirmed: true });
      if (callbacks.refetch) callbacks.refetch();
    } catch (error) {
      console.log('error', error);
    }
  };

  return (
    <button disabled={data.confirmed} className="btn btn-link btn-block btn-sm" type="button" onClick={saveItem}>
      Confirm
    </button>
  );
};

export const DisableCell = ({ data, params, callbacks }) => {
  const saveItem = async () => {
    try {
      await CrudApi(params).save(data.id, { is_disabled: !data.is_disabled });
      if (callbacks.refetch) callbacks.refetch();
    } catch (error) {
      console.log('error', error);
    }
  };

  return (
    <button className="btn btn-link btn-block btn-sm" type="button" onClick={saveItem}>
      {data.is_disabled ? 'Enable' : 'Disable'}
    </button>
  );
};

export const HTMLCell = (value) => {
  return (
    <div
      dangerouslySetInnerHTML={{ __html: value }}
      style={{
        maxWidth: 300,
        overflow: 'auto',
        maxHeight: 300,
      }}
    />
  );
};

export const URLCell = (link) => {
  if (!link) return null;

  return (
    <Link href={link}>
      <a href={link} target="_blank">
        {link}
      </a>
    </Link>
  );
};

export const MergeCell = () => {
  return (
    <button className="btn btn-link btn-block btn-sm" type="button">
      Merge
    </button>
  );
};

export const RefferralsListCell = (requests) => {
  const data = JSON.parse(requests) || [];
  const statuses = {
    pending: 0,
    confirmed: 0,
    declined: 0,
  };
  data.forEach(({ status }) => {
    statuses[status]++;
  });

  return (
    <div>
      <h6>Pending: {statuses.pending}</h6>
      <h6>Confirmed: {statuses.confirmed}</h6>
      <h6>Declined: {statuses.declined}</h6>
    </div>
  );
};
