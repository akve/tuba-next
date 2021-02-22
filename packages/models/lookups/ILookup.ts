export interface ILookupOption {
  value: number | string;
  label: string;
  fullData?: any;
}

export interface ILookupResource {
  url: string;
  value: string;
  label: string;
}

export interface ILookup {
  options?: ILookupOption[];
  resource?: ILookupResource;
  alsoSetLabelTo?: string;
}
