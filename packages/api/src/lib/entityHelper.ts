import { User } from '@pdeals/models/entities/User';
import { Language } from '@pdeals/models/entities/Language';
import { Translation } from '@pdeals/models/entities/Translation';
import { Attachment } from '@pdeals/models/entities/Attachment';
import { FilterPreset } from '@pdeals/models/entities/FilterPreset';
import { Log } from '@pdeals/models/entities/Log';
import { Color } from '@pdeals/models/entities/Color';
import { Category } from '@pdeals/models/entities/Category';
import { Collection } from '@pdeals/models/entities/Collection';
import { Product } from '@pdeals/models/entities/Product';
import { Snippet } from '@pdeals/models/entities/Snippet';

export const EntityNameToEntityMapping: any = {
  user: User,
  language: Language,
  translation: Translation,
  attachment: Attachment,
  filter_preset: FilterPreset,
  log: Log,
  color: Color,
  category: Category,
  collection: Collection,
  product: Product,
  snippet: Snippet,
};
