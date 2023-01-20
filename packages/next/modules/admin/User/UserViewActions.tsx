import { useRouter } from 'next/router';
import Link from '@pdeals/next/elements/NextLink';
import { isArray } from 'lodash';
import { useEffect } from 'react';
import { getId } from '@pdeals/next/utils/helpers';
import { getStore } from '@pdeals/next/stores/initStore';

export const ViewPokerDealsAction = () => {
  const router = useRouter();
  const userId = getId(router);

  return (
    <Link href={`/admin/users/deals/${userId}`} className="btn btn-outline-default btn-sm">
        View Accounts
    </Link>
  );
};

export const LoginAsAction = () => {
  const router = useRouter();
  const userId = getId(router);
  const onLogin = async () => {
    const store = await getStore().userStore;
    await store.loginAs(userId);
    if (store.me && store.me.role === 'admin') {
      router.push('/admin/users');
    } else {
      router.push('/user/');
    }
  };

  return (
    <a className="btn btn-outline-default btn-sm" onClick={() => onLogin()}>
      Login as
    </a>
  );
};

export const ViewEarningsAction = () => {
  const router = useRouter();
  const userId = getId(router);

  return (
    <Link href={`/admin/users/earnings/${userId}`} className="btn btn-outline-default btn-sm" >
        View Earnings
    </Link>
  );
};
