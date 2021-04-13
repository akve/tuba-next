import { Container, Row } from 'reactstrap';
import { inject, observer } from 'mobx-react';
import '@fortawesome/fontawesome-free/css/all.min.css';

import UserStore from '@pdeals/next/stores/userStore';

type Props = {
  title?: string;
  userStore?: UserStore;
};

const AdminFullLayout: React.FunctionComponent<React.PropsWithChildren<Props>> = ({ userStore, children }) => {
  if (!userStore!.me && false) {
    return <div>checking auth...</div>;
  }
  return <>{children}</>;
};

export default inject('userStore')(observer(AdminFullLayout));
