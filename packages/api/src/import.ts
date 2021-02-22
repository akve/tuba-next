// import config from './lib/config';
import { createTypeormConnection, getTypeormManager } from '@pdeals/db';
const store = require('./store.json');
import { Color } from '@pdeals/models/entities/Color';
import { Collection } from '@pdeals/models/entities/Collection';
import { Category } from '@pdeals/models/entities/Category';
import { Product } from '@pdeals/models/entities/Product';

let conn: any;
const colorsMap: any = {};
const collectionsMap: any = {};
const categoryMap: any = {};

const importColors = async (): Promise<any> => {
  await conn.query('delete from color; ');
  const repo = await getTypeormManager().getRepository(Color);
  // suppose there should be 'data' field
  for (let i = 0; i < store.colorCodes.length; i++) {
    if (!store.colorCodes[i].id) continue;
    const record = repo.create({
      name: store.colorCodes[i].id,
      data: {},
      image: store.colorCodes[i].path_big,
    });
    const e = await repo.save(record);
    colorsMap[e.name] = e.id;
  }
  return null;
};
const mapColors = async (): Promise<any> => {
  const rows = await conn.query('select * from color ');
  rows.forEach((e: any) => {
    colorsMap[e.name] = e.id;
  });
  return null;
};

const importCollections = async (): Promise<any> => {
  await conn.query('delete from collection; ');
  const repo = await getTypeormManager().getRepository(Collection);
  // suppose there should be 'data' field
  for (let i = 0; i < store.groups.length; i++) {
    if (!store.groups[i].id) continue;
    const record = repo.create({
      code: store.groups[i].id,
      parent: 'collection',
      data: {},
      name: store.groups[i].title,
    });
    const e = await repo.save(record);
    collectionsMap[e.code] = e.id;
  }
  for (let i = 0; i < store.categories.length; i++) {
    if (!store.categories[i].id) continue;
    const record = repo.create({
      code: store.categories[i].id,
      parent: 'category',
      data: {},
      name: store.categories[i].title,
    });
    const e = await repo.save(record);
    collectionsMap[e.code] = e.id;
  }
  //  console.log(collectionsMap);
  return null;
};
const mapCollections = async (): Promise<any> => {
  const rows = await conn.query('select * from collection ');
  rows.forEach((e: any) => {
    collectionsMap[e.code] = e.id;
  });
  return null;
};

const importCategories = async (): Promise<any> => {
  await conn.query('delete from category; ');
  const repo = await getTypeormManager().getRepository(Category);
  // suppose there should be 'data' field
  const newRecord = await repo
    .create({
      code: 'new',
      parent: 0,
      invisible: 'true',
      name: 'New',
      data: {},
    })
    .save();
  categoryMap['new'] = newRecord.id;
  const saleRecord = await repo
    .create({
      code: 'sale',
      parent: 0,
      invisible: 'true',
      name: 'Sale',
      sorter: 1,
      data: {},
    })
    .save();
  categoryMap['sale'] = saleRecord.id;
  const featRecord = await repo
    .create({
      code: 'featured',
      parent: 0,
      invisible: 'true',
      name: 'Featured',
      data: {},
    })
    .save();
  categoryMap['featured'] = featRecord.id;
  for (let i = 0; i < store.dresstypes.length; i++) {
    if (!store.dresstypes[i].id) continue;
    const record = repo.create({
      code: store.dresstypes[i].id,
      parent: 0,
      data: {},
      sorter: i + 1,
      name: store.dresstypes[i].title,
    });
    const e = await repo.save(record);
    categoryMap[e.code] = e.id;
  }
  //  console.log(collectionsMap);
  return null;
};

const mapCategories = async (): Promise<any> => {
  const rows = await conn.query('select * from category ');
  rows.forEach((e: any) => {
    categoryMap[e.code] = e.id;
  });
  return null;
};
/*
*   @Column()
  code: string;

  @Column({ nullable: true })
  name: string;

  @Column({ nullable: true })
  image: string;

  @Column({ nullable: true, type: 'float' })
  price: number;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  invisible: boolean;

  @Column({ nullable: true, type: 'float' })
  sorter: number;

  @Column({ type: 'json' })
  data?: object;*/
const importProducts = async (): Promise<any> => {
  await conn.query('delete from product; ');
  const repo = await getTypeormManager().getRepository(Product);
  // suppose there should be 'data' field
  for (let i = 0; i < store.layer1.length; i++) {
    const r: any = store.layer1[i];
    if (!r.id) continue;
    const categories: any[] = [];
    const collections: any[] = [];
    if (r.categories) {
      r.categories.forEach((cat: any): any => {
        if (collectionsMap[cat]) collections.push({ collection: collectionsMap[cat], name: cat });
      });
    }
    if (r.group) {
      if (collectionsMap[r.group]) collections.push({ collection: collectionsMap[r.group], name: r.group });
    }
    if (r.dresstypes) {
      r.dresstypes.forEach((dt: any): any => {
        if (dt.id && categoryMap[dt.id]) categories.push({ category: categoryMap[dt.id], name: dt.id });
      });
    }
    if (r.featured) {
      categories.push({ category: categoryMap['featured'], name: 'Featured' });
    }
    if (r.isnew) {
      categories.push({ category: categoryMap['new'], name: 'New' });
    }
    const record = repo.create({
      code: r.id,
      name: r.title,
      image: r.images.length ? r.images[0].path : '',
      price: isNaN(parseInt(r.price)) ? 0 : parseInt(r.price),
      pricediscount: isNaN(parseInt(r.pricediscount)) ? 0 : parseInt(r.pricediscount),
      description: r.description,
      invisible: !!r.invisible,
      sorter: i + 1,
      data: {
        images: r.images.map((img: any) => {
          return { image: img.path };
        }),
        categories: categories,
        collections: collections,
      },
    });
    await repo.save(record);
    // collectionsMap[e.code] = e.id;
  }
  //  console.log(collectionsMap);
  return null;
};

const run = async () => {
  conn = await createTypeormConnection();
  console.log(`Connected to database. Connection: ${conn.name} / ${conn.options.database}`);
  console.log(
    importColors,
    mapColors,
    mapCollections,
    importCollections,
    importCategories,
    mapCategories,
    importProducts
  );
  // await importColors();
  await mapColors();
  // await importCollections();
  await mapCollections();
  // await importCategories();
  await mapCategories();

  await importProducts();
  // console.log(categoryMap);
  // delete from product; delete from category; delete from collection;
  console.log('DONE');
};

run();
