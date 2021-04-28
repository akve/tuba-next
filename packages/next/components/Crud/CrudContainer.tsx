import { useEffect, useState } from 'react';
import { inject, observer } from 'mobx-react';
import UserStore from '../../stores/userStore';
import { ICrud } from '@pdeals/next/components/Crud/ICrud';
import { useRouter } from 'next/router';
import AdminFullLayout from '@pdeals/next/components/layouts/AdminFullLayout';
import CrudList from '@pdeals/next/components/Crud/CrudList/CrudList';
import CrudFormWrapper from '@pdeals/next/components/Crud/CrudForm/CrudFormWrapper';
import { getId } from '@pdeals/next/utils/helpers';
import UiStore from '@pdeals/next/stores/uiStore';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
interface IProps {
  title?: string;
  params: ICrud;
  uiStore?: UiStore;
}

function CrudContainer(props: IProps) {
  const router = useRouter();
  const id = getId(router);

  const [view, setView] = useState('');

  useEffect(() => {
    const { breadcrumbsData } = props.params;
    const myBreadcrumbs = [...(breadcrumbsData?.breadcrumbs || [])];

    if (router.asPath.endsWith('/create') || router.asPath.endsWith('/create')) {
      myBreadcrumbs.push({ title: 'Create' });
      setView('create');
    } else if (router.asPath.endsWith('/edit') || router.asPath.endsWith('/edit/')) {
      myBreadcrumbs.push({ id });
      setView('edit');
    } else {
      setView('list');
    }
    props.uiStore?.setBreadCrumbResolvers(breadcrumbsData?.resolvers);
    props.uiStore?.setBreadCrumbs(myBreadcrumbs);
  }, [router.asPath]);

  return (
    <AdminFullLayout>
      {view === 'create' && <CrudFormWrapper params={props.params} />}
      {view === 'list' && <CrudList params={props.params} />}
      {view === 'edit' && <CrudFormWrapper params={props.params} id={parseInt(id, 10)} />}
    </AdminFullLayout>
  );
}

export default inject('userStore', 'uiStore')(observer(CrudContainer));
