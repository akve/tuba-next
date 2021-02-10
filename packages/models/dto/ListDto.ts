class ListUserFilterDto {
  field: string;
  value: any;
  condition: 'eq' | 'neq' | 'like' | 'gt' | 'gte' | 'lt' | 'lte';
  fieldtype?: string;
}

class ListRequestDto {
  sort?: string;
  sortDirectionIsAsc?: boolean;
  limit?: number;
  offset?: number;
  filter?: { [key: string]: number | boolean | string | null }; //Record<string, number | boolean | string | null>;
  userFilter?: ListUserFilterDto[];
  isCsv?: boolean;
}

class ListDto<T> {
  count: number;
  rows: T[];
}

export { ListRequestDto, ListDto };
