import { Factory, Seeder } from 'typeorm-seeding';
import { Connection } from 'typeorm';
import { Language } from '@pdeals/models/entities/Language';

export const languages = [
  {
    id: 1,
    code: 'en',
    name: 'English',
    is_enabled_frontend: true,
    is_enabled_public: true,
  },
];

export default class CreateLanguages implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<any> {
    await connection.createQueryBuilder().insert().into(Language).values(languages).execute();
  }
}
