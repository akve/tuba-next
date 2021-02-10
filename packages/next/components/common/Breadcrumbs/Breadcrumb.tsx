import React, { FC, useState, useEffect, memo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { inject, observer } from 'mobx-react';
import { BreadcrumbItem } from 'reactstrap';
import { ResolveApi } from '@pdeals/next/lib/api/resolver-api';
import UiStore from '@pdeals/next/stores/uiStore';

import { IBreadcrumb } from '@pdeals/next/components/Crud/ICrud';

interface Props {
  breadcrumbData: IBreadcrumb;
  resolvers?: any;
  uiStore?: UiStore;
  title?: string;
}

const Breadcrumb: FC<Props> = (props) => {
  const router = useRouter();
  const [data, setData] = useState<IBreadcrumb>({});

  useEffect(() => {
    const { uiStore } = props;
    if (uiStore) {
      uiStore.setBreadCrumbTitle(props.title);
    }
  }, [props.title]);

  useEffect(() => {
    const { breadcrumbData, resolvers = {}, title, uiStore } = props;

    const normalizeData = async ({ id, resolvers: customResolvers = {} }: IBreadcrumb) => {

      try {
        const entity = customResolvers.entity || resolvers?.entity;
        if (!entity) return;

        const result = await ResolveApi({ entity }).getName(id);
        const breadcrumb = {
          title: customResolvers.title && customResolvers.title(result) || resolvers.title && resolvers.title(result),
          link: customResolvers.link && customResolvers.link(result) || resolvers.link && resolvers.link(result),
        };
        setData(breadcrumb);
        if (uiStore && !data.title) {
          uiStore.setBreadCrumbTitle(breadcrumb.title);
        }
      } catch (e) {
        console.log('error', e);
      }
    };

    if (breadcrumbData.id) {
      normalizeData(breadcrumbData);
    } else {
      setData(breadcrumbData);
    }
  }, [router.pathname]);

  const handleClick = () => {
    props.uiStore?.setBreadCrumbTitle(data.title)
  };

  return (
    <BreadcrumbItem>
      {data.link ? (
        <Link href={data.link}>
          <a href={data.link} onClick={handleClick}>
            {data.icon ? (
              <i className={data.icon} />
            ) : (
              data.title
            )}
          </a>
        </Link>
      ) : (
        <span style={{ color: 'white' }}>
          {data.icon ? (
            <i className={data.icon} />
          ) : (
            data.title
          )}
        </span>
      )}
      
    </BreadcrumbItem>
  );
};

export default inject('uiStore')(observer(Breadcrumb));
// export default Breadcrumb;
