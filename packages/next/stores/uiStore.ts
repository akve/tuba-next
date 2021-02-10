import { action, observable, computed } from 'mobx';
// import { toast } from 'react-toastify';
import { ADD_NOTIFICATION, publish } from '../utils/eventBus';
import { IBreadcrumb } from '@pdeals/next/components/Crud/ICrud';

interface IListActionDescriptor {
  action: string;
  parameters: any;
  refetch?: any;
}

class UiStore {
  @observable notifications: any[] = [];

  @observable _displayedUids: any[] = [];

  @observable toastType: string | null = null;

  @observable toastMesssage: string = '';

  @observable listAction: IListActionDescriptor | null = null;

  @observable breadCrumbs: { data: IBreadcrumb[]; title: string; resolvers: any } = {
    data: [],
    title: '',
    resolvers: {},
  };

  @observable allData: any;

  constructor() {
    setInterval(() => {
      if (!this.notifications.length) return;
      this.notifications = this.notifications.filter((notif) => {
        return !(notif.added < new Date().getTime() - 20000);
      });
    }, 1000);
  }

  @action setAllData(data:any) {
    this.allData = data;
  }


  @action setBreadCrumbs(breadCrumbs) {
    this.breadCrumbs.data = breadCrumbs;
  }

  @action setBreadCrumbTitle(title) {
    this.breadCrumbs.title = title;
  }

  @action setBreadCrumbResolvers(resolvers) {
    this.breadCrumbs.resolvers = resolvers || {};
  }

  @action setListAction(action: IListActionDescriptor | null) {
    this.listAction = action;
  }

  @action addNotification = (
    level: string = 'warning',
    title: string = '',
    message: string,
    position = 'tr',
    autoDismiss = 3
  ) => {
    const uid = new Date().getTime().toString();
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const self = this;

    const shownNow = this.PendingNotifications;
    const existing = shownNow.filter((notif: any) => notif.message === message);
    if (existing && existing.length) {
      console.log('already shown');
      return;
    }
    this.toastType = level;
    this.toastMesssage = message;

    publish(ADD_NOTIFICATION, {
      uid,
      title,
      message,
      level,
      position,
      autoDismiss,
    });
    /* if (level === 'info') {
  toast.info(message);
}
if (level === 'error') {
  toast.error(message);
}
if (level === 'success') {
  toast.success(message);
} */
    // return;

    // console.log('add', self.notifications, self._displayedUids);

    self.notifications.unshift({
      uid,
      title,
      message,
      level,
      position,
      autoDismiss,
      added: new Date().getTime(),
      onAdd: (n: any) => {
        const count = self.notifications.length || 0;
        self._displayedUids.unshift(n.uid);

        if (count > 30) {
          self.notifications.pop();
          self._displayedUids.pop();
        }
      },
    });
  };

  @action hideNotification(notification: any) {
    this._displayedUids = this._displayedUids.filter((n) => n != notification.uid);
    this.notifications = this.notifications.filter((notif) => notif.uid !== notification.uid);
  }

  @computed get PendingNotifications(): any {
    return this.notifications.filter((notif) => {
      return !this._displayedUids.includes(notif.uid);
    });
  }
}

export default UiStore;
