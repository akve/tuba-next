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

  @observable productDetails: any = null;

  @observable list: any = [];

  @observable snippets: any = null;

  @observable reviews: any = null;

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

  @action setProductDetails(data: any) {
    this.productDetails = data;
  }

  @action setAllData(data: any) {
    if (this.allData) return;
    this.allData = data;
  }

  @action setList(data: any) {
    this.list = data;
  }

  @action setSnippets(data) {
    this.snippets = data;
  }

  @action setReviews(data) {
    this.reviews = data;
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

    let result = this.list;

    const sortProducts = (cat: number, prods: any[]) => {
      const all = this.list;
      if (!all || !all.sorting) return prods;
      const sorts = filter(all.sorting, (r: any) => r.category === cat);
      const outList: any = [];
      // pass 1. put the "known"
      const outListIds: any = [];
      sorts.forEach((sortRow: any) => {
        const prod = find(prods, (r: any) => r.id === sortRow.product);
        if (prod) {
          outList.push(prod);
          outListIds.push(prod.id);
        }
      });
      // pass 2. put rest
      prods.forEach((prodRow: any) => {
        if (outListIds.indexOf(prodRow.id) < 0) {
          outList.push(prodRow);
        }
      });
      return outList;
    };

    result = sortProducts(categoryId, result.products);
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
    const p = this.productDetails; // find(this.allData.products, (r: any) => `${r.code}` === `${this.product}`);
    if (!p) return {};
    console.log('!!!', p, this.allData);
    const categories = get(p, 'product.categories') || null;
    //console.log('FOUND?', p, this.allData, categories);
    let categoryId: any = null;
    if (categories) {
      categoryId = find(categories, (r) => ['featured', 'new', 'sale'].indexOf(r.name) < 0);
      if (categoryId) categoryId = categoryId.category;
    }
    if (categoryId) {
      p.category = find(this.allData.categories.rows, (r: any) => `${r.id}` === `${categoryId}`);
    }
    if (!p.product.data.images) p.product.data.images = [];
    if (!p.image) {
      p.image = p.product.data.images[0].image;
    }
    return p;
  }

  @action getCategoryBreadcrumb(input: string) {
    const result = {
      code: '',
      name: '',
      prefix: '',
      originalName: '',
      parent: 0,
    };
    const [prefix, name] = input.split('-', 2);
    const codename = name && name.indexOf('_') > 0 ? name.split('_').pop() : name;
    if (!name) return null;
    let item;
    if (prefix === 'category') {
      item = find(this.allData.categories.rows, (r: any) => `${r.code}` === `${codename}` || r.code === name);
    } else {
      item = find(this.allData.collections, (r: any) => `${r.code}` === `${codename}`);
    }
    if (item) {
      result.name = item.name;
      result.originalName = item.originalName;
      result.parent = item.parent;
    }
    result.code = name;
    result.prefix = prefix;
    return result;
  }
}

export default UiStore;
