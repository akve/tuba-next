import { ILookup } from './ILookup';

/*{
  "kurtki": 4635193,
  'palto': 4635201,
  "sukni": 4637327,
  "skirts": 4637239,
  "sarafany": 4637223,
  "gilety": 4635287,
  "sviter": 4637383,
  "shtany": 4638207
}*/

const RozetkaCategoryLookup: ILookup = {
  options: [
    { value: '4635193', label: 'Куртки' },
    { value: '4635201', label: 'Пальто' },
    { value: '4637327', label: 'Платье' },
    { value: '4637239', label: 'Юбка' },
    { value: '4637223', label: 'Сарафан' },
    { value: '4635287', label: 'Жилет' },
    { value: '4637383', label: 'Свитер' },
    { value: '4638207', label: 'Штаны' },
  ],
};

export { RozetkaCategoryLookup };
