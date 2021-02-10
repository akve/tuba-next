import { ILookup } from '@pdeals/models/lookups/ILookup';

export interface IFormField {
  type: string;
  label: string;
  name: string;
  children?: IFormField[];
  class?: string;
  fieldSpecificParams?: any;
  options?: ILookup;
  notEditable?: boolean;
  canBeTranslated?: boolean;
  defaultValue?: string | number;
  required?: boolean;
  component?: any;
}
export interface IExternalComponentProps {
  data: any;
}
export type IExternalComponent = (props: IExternalComponentProps) => JSX.Element;

export interface IFormData {
  fields: IFormField[];
  extraButtons?: IExternalComponent;
}
export interface IListColumn {
  text: string;
  dataField: string;
  formatter?: any;
  editable?: boolean;
  sort?: boolean;
  isDummyField?: boolean;
  footer?: any;
}

export interface IOptions {
  isEditable?: boolean;
  isCreatable?: boolean;
  isDeletable?: boolean;
  formPreSaveFunction?: any;
  listDefaultSortField?: string;
  listDefaultSortDirection?: 'asc' | 'desc';

}

export type FilterFieldType = 'text' | 'number' | 'checkbox' | 'date' | 'range' | 'lazydropdown'; // should be extended
export interface IFilterField {
  field: string;
  fieldType: FilterFieldType;
  fieldLabel: string;
  options?: any;
}

export interface IBreadcrumb {
  title?: string;
  link?: string;
  icon?: string;
  id?: number;
  resolvers?: any;
}

export interface ICrud {
  apiUrlPrefix: string;
  uiUrlPrefix: string;
  tableKey: string;
  overrideListUrlPrefix?: string;
  title: string;
  listColumns: IListColumn[];
  translatableEntity?: boolean;
  form: IFormData;
  listFilterTopComponent?: any;
  userFilter?: IFilterField[];
  defaultUserFilter?: Array<any>;
  filter?: Array<any>;
  defaultFilter?: any;
  tableActions?: Array<any>;
  editActions?: Array<any>;
  createActions?: Array<any>;
  rowActions?: Array<any>;
  rowMainActions?: Array<any>;
  options?: IOptions;
  breadcrumbsData?: {
    breadcrumbs: IBreadcrumb[];
    resolvers?: any;
  };
  // used to pass extra things from "configuration-holder" class, usually page, to all the components inside
  context?: any;
}
