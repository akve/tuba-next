import { action, observable, computed } from 'mobx';
// import { toast } from 'react-toastify';
import { ADD_NOTIFICATION, publish } from '../utils/eventBus';
import { IBreadcrumb } from '@pdeals/next/components/Crud/ICrud';
import { filter, find, get, sortBy } from 'lodash';

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

  @observable category: string | null = null;

  @observable collection: string | null = null;

  @observable product: string | null = null;

  @observable breadCrumbs: { data: IBreadcrumb[]; title: string; resolvers: any } = {
    data: [],
    title: '',
    resolvers: {},
  };

  @observable sliderWidth = 0;

  @observable allData: any;

  constructor() {
    setInterval(() => {
      if (!this.notifications.length) return;
      this.notifications = this.notifications.filter((notif) => {
        return !(notif.added < new Date().getTime() - 20000);
      });
    }, 1000);
  }

  @action setCategory(cat: string) {
    this.category = cat;
  }

  @action setCollection(cat: string) {
    this.collection = cat;
  }

  @action setProduct(id: string | number) {
    this.product = `${id}`;
  }

  @action setAllData(data: any) {
    if (this.allData) return;
    this.allData = data;
  }

  @action getListByCategory(category: string, isForCollection?: boolean) {
    if (!category) return this.allData.products;
    console.log('filter by', category, isForCollection);
    let categoryRecord = find(this.allData.categories.rows, (r) => r.code === category);
    if (isForCollection) {
      categoryRecord = find(this.allData.collections, (r) => r.code === category || `${r.id}` === category);
    }
    if (!categoryRecord) return [];
    const categoryId = categoryRecord.id;
    console.log('???', categoryId);

    let result = filter(this.allData.products, (r: any) => {
      if (r.invisible) return false;
      const rCategories: any = isForCollection ? r.data.collections : r.data.categories;
      if (rCategories && rCategories.length) {
        return !!find(rCategories, (c: any) => `${isForCollection ? c.collection : c.category}` === `${categoryId}`);
      }
      return false;
    });
    result = sortBy(result, (r) => r.sorter);
    return result;
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

  @action setSliderWidth(w) {
    this.sliderWidth = w;
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

  @computed get ProductDetails(): any {
    const p = find(this.allData.products, (r: any) => `${r.code}` === `${this.product}`);
    if (!p) return {};
    const categories = get(p, 'data.categories') || null;
    console.log('FOUND?', p, this.allData, categories);
    let categoryId: any = null;
    if (categories) {
      categoryId = find(categories, (r) => ['featured', 'new', 'sale'].indexOf(r.name) < 0);
      if (categoryId) categoryId = categoryId.category;
    }
    if (categoryId) {
      p.category = find(this.allData.categories.rows, (r: any) => `${r.id}` === `${categoryId}`);
    }
    if (!p.image) {
      p.image = p.data.images[0].image;
    }
    if (!p.data.images) p.data.images = [];
    return p;
  }
}

export default UiStore;
