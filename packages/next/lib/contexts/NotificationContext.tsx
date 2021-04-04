import { createContext, useRef } from 'react';
import NotificationAlert from 'react-notification-alert';

export const NotificationContext = createContext({
  notify: (type: string, title: string, message: string): void => {},
});

export const NotificationProvider = ({ children }) => {
  const notificationAlert = useRef<any>(null);

  const notify = (type, title, message) => {
    console.log('NOTIFY', message);
    const options = {
      place: 'tc',
      message: (
        <div className="alert-text">
          <span className="alert-title" data-notify="title">
            {' '}
            {title}
          </span>
          <span data-notify="message">{message}</span>
        </div>
      ),
      type,
      icon: 'ni ni-bell-55',
      autoDismiss: 7,
    };
    if (notificationAlert && notificationAlert.current) {
      notificationAlert.current.notificationAlert(options);
    }
  };

  const value = {
    notify,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
      <div className="rna-wrapper">
        <NotificationAlert ref={notificationAlert} />
      </div>
    </NotificationContext.Provider>
  );
};
