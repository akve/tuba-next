// import config from './lib/config';
import { createTypeormConnection, getTypeormManager } from '@pdeals/db';
import { Review } from '@pdeals/models/entities/Review';

import * as csv from 'csv-parse/lib/sync';
import * as fs from 'fs';

let conn: any;

const importReviews = async (): Promise<any> => {
  await conn.query('delete from review; ');
  const repo = await getTypeormManager().getRepository(Review);
  const txt = fs.readFileSync(__dirname + '/importer/reviews.csv', 'utf-8');

  const arr = csv(txt, { columns: false });
  for (let i = 0; i < arr.length; i++) {
    const r = arr[i];
    const record = repo.create({
      score: r[2],
      username: r[1],
      score_date: new Date(r[3]),
      description: r[0],
      data: {},
    });
    await repo.save(record);
  }
  return null;
};

const run = async () => {
  conn = await createTypeormConnection();
  console.log(`Connected to database. Connection: ${conn.name} / ${conn.options.database}`);

  await importReviews();
  // console.log(categoryMap);
  // delete from product; delete from category; delete from collection;
  console.log('DONE');
};

run();
