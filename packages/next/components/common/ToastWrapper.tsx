import { useEffect, useRef } from 'react';
import { inject, observer } from 'mobx-react';
import { Toast, ToastHeader, ToastBody } from 'reactstrap';
import classNames from 'classnames';
//import { faExclamationTriangle, faCheck } from '@fortawesome/free-solid-svg-icons';
//import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import UiStore from '@pdeals/next/stores/uiStore';
import NotificationAlert from 'react-notification-alert';
// react component used to create sweet alerts
// import ReactBSAlert from 'react-bootstrap-sweetalert';
import { ADD_NOTIFICATION, subscribe } from '@pdeals/next/utils/eventBus';

interface ToastProps {
  uiStore: UiStore;
}
const _ToastWrapper = ({ uiStore }: ToastProps) => {
  const toastsRef = useRef<HTMLDivElement>(null);
  const notificationAlertRef = useRef(null);

  const store = uiStore;

  const onHide = (notification: any): void => {
    toastsRef.current?.children.namedItem(notification.uid)?.classList.add('should-be-hidden');
    setTimeout(() => {
      store.hideNotification(notification);
    }, 700);
  };
  const notify = (data) => {
    let eType = 'info';
    switch (data.level) {
      case 'error':
        eType = 'warning';
        break;
      case 'success':
        eType = 'success';
        break;
      default:
        eType = 'info';
    }
    let options = {
      place: 'tc',
      message: (
        <div className="alert-text">
          <span className="alert-title" data-notify="title">
            {' '}
            {data.title || 'Notification'}
          </span>
          <span data-notify="message">{data.message}</span>
        </div>
      ),
      type: eType,
      icon: 'ni ni-bell-55',
      autoDismiss: data.autoDismiss || 3,
    };
    if (notificationAlertRef && notificationAlertRef.current)
      (notificationAlertRef.current as any).notificationAlert(options);
  };

  useEffect(() => {
    subscribe(ADD_NOTIFICATION, (data, msg) => {
      notify(data);
    });
  }, []);

  /*useEffect(() => {
    uiStore.PendingNotifications.forEach((notification) => {
      notify('error');
    });
  }, [uiStore.PendingNotifications]);*/
  //console.log('???', store.PendingNotifications);

  return (
    <div className="toasts-wrapper rna-wrapper" ref={toastsRef}>
      <NotificationAlert ref={notificationAlertRef} />
    </div>
  );
};

const ToastWrapper = inject('uiStore')(observer(_ToastWrapper));

export { ToastWrapper };
