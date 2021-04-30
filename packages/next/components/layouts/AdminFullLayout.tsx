import { Container, Row } from 'reactstrap';
import { inject, observer } from 'mobx-react';
//import '@fortawesome/fontawesome-free/css/all.min.css';
//import '../../assets/plugins/nucleo/css/nucleo.module.css';
//import '../../assets/scss/nextjs-argon-dashboard-pro.module.scss';
// import Head from 'next/head';
import UserStore from '@pdeals/next/stores/userStore';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
//import { getFullCss } from '@pdeals/next/modules/css-generated';

type Props = {
  title?: string;
  userStore?: UserStore;
};

const AdminFullLayout: React.FunctionComponent<React.PropsWithChildren<Props>> = ({ userStore, children }) => {
  const router = useRouter();
  const check = async () => {
    if (!userStore?.me) {
      try {
        await userStore?.checkMe();
      } catch (e) {
        userStore?.logout();
        router.push('/auth/login');
      }
    }
  };
  useEffect(() => {
    check();
  }, []);

  if (!userStore!.me) {
    return <div>checking auth...</div>;
  }
  return (
    <>
      {' '}
      :)
      {/*<Head>
        <style dangerouslySetInnerHTML={{ __html: getFullCss() }} />
      </Head>*/}
      {children}
    </>
  );
};

export default inject('userStore')(observer(AdminFullLayout));
