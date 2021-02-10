import { useRouter } from 'next/router';
import Link from 'next/link';
import { isArray } from 'lodash';
import { getId } from '@pdeals/next/utils/helpers';

export const UserDealsFilterSwitch = () => {
  const router = useRouter();
  const userId = `${router.query.id}`;

  return (
    <>
      {(userId === 'all' || userId === 'orphaned') && (
        <>
          <Link href={`/admin/users/deals/all`}>
            <a className="btn btn-outline-default btn-sm" href={`/admin/users/deals/all`}>
              {userId === 'all' && <i className="ni ni-check-bold" />}&nbsp;All
            </a>
          </Link>
          <Link href={`/admin/users/deals/orphaned`}>
            <a className="btn btn-outline-default btn-sm" href={`/admin/users/deals/orphaned`}>
              {userId === 'orphaned' && <i className="ni ni-check-bold" />}&nbsp;Orphaned
            </a>
          </Link>
        </>
      )}
    </>
  );
};
