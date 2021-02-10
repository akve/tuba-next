import { useEffect, useState, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { Button, Form } from 'reactstrap';
import { inject, observer } from 'mobx-react';

import { IFilterField } from '@pdeals/next/components/Crud/ICrud';
import { getRenderer } from '@pdeals/next/components/registerFormRenderer/index';
import { counterCreater } from '@pdeals/next/utils/helpers';
import UserStore from '@pdeals/next/stores/userStore';
import { CrudApi } from '@pdeals/next/lib/api/crud-api';

export interface IFilterValue {
  field: string;
  condition: string;
  value: any;
}

export interface IFilterProps {
  fields: IFilterField[];
  defaultFields: Array<IFilterValue>;
  onApplyFilter: (values: IFilterValue[]) => void;
  userStore?: UserStore;
  tableKey?: string;
}

const KNOWN_CONDITIONS = {
  text: [
    { value: 'like', label: 'Like' },
    { value: 'eq', label: 'Equals' },
    { value: 'neq', label: 'Not equals' },
  ],
  number: [
    { value: 'eq', label: 'Equals' },
    { value: 'neq', label: 'Not equals' },
    { value: 'gt', label: 'Greater than' },
    { value: 'gte', label: 'Greater than or equal' },
    { value: 'lt', label: 'Less than' },
    { value: 'lte', label: 'Less than or equal' },
  ],
  date: [
    { value: 'gt', label: 'Later than' },
    { value: 'gte', label: 'Later than or equal' },
    { value: 'lt', label: 'Earlier than' },
    { value: 'lte', label: 'Earlier than or equal' },
    { value: 'eq', label: 'Equals' },
    { value: 'neq', label: 'Not equals' },
  ],
  range: [{ value: 'range', label: 'Range' }],
  checkbox: [{ value: 'eq', label: 'Equals' }],
  lazydropdown: [{ value: 'eq', label: 'Equals' }],
};

const ListFilter = (props: IFilterProps) => {
  let defaults = props.defaultFields;
  const count = useMemo(() => counterCreater(props.defaultFields.length), [props.defaultFields.length]);
  if (defaults.length === 0) {
    defaults = [{field:'',condition:'', value:''}];
  }
  const [currentPresetFilter, setCurrentPresetFilter] = useState('');
  const [values, setValues] = useState<number[]>(defaults.map((_, index) => index));
  const [presetFilters, setPresetFilters] = useState({});
  const { register: register1, handleSubmit: handleSubmit1, setValue, watch, reset, getValues, ...rest } = useForm();
  const {
    register: register2,
    handleSubmit: handleSubmit2,
    setValue: setValue2,
    watch: watch2,
    reset: reset2,
    getValues: getValues2,
    ...rest2
  } = useForm();


  const fetchFilterPreset = async () => {
    try {
      const resp: any = await CrudApi({ apiUrlPrefix: 'filter_preset' } as any).getObjects({
        userFilter: [
          { condition: 'eq', field: 'user_id', value: props.userStore?.me?.id },
          { condition: 'eq', field: 'table_key', value: props.tableKey },
        ],
      });
      const normalizedPresetFilterData = resp.rows.reduce(
        (accumData, { name, data, ...rest }) => ({
          ...accumData,
          [name]: {
            ...rest,
            data: typeof data === 'string' ? JSON.parse(data) : data,
          },
        }),
        {}
      );
      setPresetFilters(normalizedPresetFilterData);
    } catch (e) {
      console.log('error', e);
    }
  };

  useEffect(() => {
    if (props.userStore?.me?.id) {
      fetchFilterPreset();
    }
  }, [props.userStore?.me?.id]);

  useEffect(() => {
    props.defaultFields.forEach(({ field, condition, value }, index) => {
      setValue(`condition-${index}`, condition);
      setValue(`field-${index}`, field);
      setValue(`value-${index}`, value);
    });
  }, []);

  const getFilterColumns = () => {
    const columns = props.fields.map((r) => {
      return { label: r.fieldLabel, value: r.field };
    });
    return [{ label: '...', value: '' }, ...columns];
  };
  const getFilterConditions = (fieldName) => {
    const fld = props.fields.find((r) => r.field === fieldName);
    if (!fld) return [];
    return KNOWN_CONDITIONS[fld.fieldType] || [];
  };

  const getFilterValueType = (fieldName) => {
    const fld = props.fields.find((r) => r.field === fieldName);
    if (!fld) return 'text';
    return fld.fieldType;
  };

  const getFilterValueOptions = (fieldName) => {
    const fld = props.fields.find((r) => r.field === fieldName);
    if (!fld) return null;
    return fld.options;
  };

  const onRemoveFilterRow = (index: number) => {
    setValues((prevValues) => prevValues.filter((val) => val !== index));
  };

  const onAddEmptyFilterRow = () => {
    setValues((prevValues) => [...prevValues, count()]);
  };

  const normalizeFilterData = (values) => {
    const fieldsIndex = Object.keys(values)
      .filter((key) => key.includes('field') && values[key])
      .map((key) => key.split('-')[1]);
    const userFilter = fieldsIndex
      .map((ind) => ({
        field: values[`field-${ind}`],
        condition: values[`condition-${ind}`],
        value: values[`value-${ind}`],
        fieldtype: getFilterValueType(values[`field-${ind}`]),
      }))
      .filter(({ value }) => value || value === false);

    return userFilter;
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const normalizeAndSave = (values: any) => {
      const userFilter = normalizeFilterData(values);

      props.onApplyFilter(userFilter);
    };

    handleSubmit1(normalizeAndSave)();
  };

  const submitPresetFilter = (event) => {
    event.preventDefault();
    event.stopPropagation();

    const normalizeAndSave = async (values: any) => {
      const { filterName } = values;
      const filterData = getValues();
      const normalizedFilterData = normalizeFilterData(filterData);

      if (normalizedFilterData.length && filterName) {
        try {
          await CrudApi({ apiUrlPrefix: 'filter_preset' } as any).create({
            user_id: props.userStore?.me?.id || 1,
            table_key: props.tableKey,
            data: { filters: normalizedFilterData },
            name: filterName,
          });
          fetchFilterPreset();
          setValue2('filterName', '');
        } catch (e) {
          console.log('error', e);
        }
      }
    };

    handleSubmit2(normalizeAndSave)();
  };

  const setPresetFilter = (name) => {
    const presetFilter: any = presetFilters[name];
    const presetFilerData = presetFilter?.data?.filters || [];
    const ids = presetFilerData.map(() => count());
    setValues(ids);
    setValue2('filterName', name);
    props.onApplyFilter(presetFilerData);
    setCurrentPresetFilter(name);
    setTimeout(() => {
      presetFilerData.forEach(({ field, condition, value }, index) => {
        setValue(`condition-${ids[index]}`, condition);
        setValue(`field-${ids[index]}`, field);
        setValue(`value-${ids[index]}`, value);
      });
    }, 0);
  };

  const removePresetFilter = async (name) => {
    const presetFilter: any = presetFilters[name];
    const id = presetFilter?.id;

    try {
      await CrudApi({ apiUrlPrefix: 'filter_preset' } as any).delete(id);
      fetchFilterPreset();
    } catch (e) {
      console.log('error', e);
    }
  };

  const renderField = (type, props) => {
    const Component = getRenderer(type);
    return Component ? <Component {...props} /> : null;
  };

  const DropdownField = getRenderer('dropdown');

  return (
    <Form onSubmit={handleSubmit}>
      <div className="mb-2">
        Filter {Object.keys(presetFilters).length > 0 && <>|&nbsp;</>}
        {Object.keys(presetFilters).map((name) => (
          <span key={name} className="mr-3" style={{ whiteSpace: 'nowrap', lineHeight: '40px' }}>
            <Button
              type="button"
              color="outline-primary"
              size="sm"
              className="mr-0"
              onClick={() => setPresetFilter(name)}
            >
              {name}
            </Button>
          </span>
        ))}
      </div>
      <table>
        {values.map((key) => (
          <tr key={key}>
            <td style={{ minWidth: 150 }}>
              <DropdownField
                name={`field-${key}`}
                innerRef={register1({})}
                options={{ options: getFilterColumns() }}
                class="input-group-sm mb-0"
              />
            </td>
            <td style={{ minWidth: 200 }}>
              {renderField('dropdown', {
                name: `condition-${key}`,
                innerRef: register1({}),
                type: 'dropdown',
                class: 'input-group-sm mb-0',
                disabled: !watch(`field-${key}`, '') || !getFilterConditions(watch(`field-${key}`, '')).length,
                options: { options: getFilterConditions(watch(`field-${key}`, '')) },
                setValue: setValue,
                initialValue: props.defaultFields[key]?.condition,
              })}
            </td>
            <td className="" style={{ minWidth: 200 }}>
              {renderField(getFilterValueType(watch(`field-${key}`, '')), {
                name: `value-${key}`,
                innerRef: register1({}),
                type: getFilterValueType(watch(`field-${key}`, '')),
                class: 'input-group-sm mb-0',
                disabled: !watch(`field-${key}`, ''),
                setValue: setValue,
                initialValue: watch(`value-${key}`),
                options: getFilterValueOptions(watch(`field-${key}`, null)),
              })}
            </td>
            <td>
              {!!watch(`field-${key}`) && (
              <div style={{display:'flex'}}>
                <Button
                  color="outline-warning"
                  className="ml-3"
                  onClick={() => onRemoveFilterRow(key)}
                  size="sm"
                  type="button"
                >
                  <i className="fas fa-trash" />
                </Button>
                <Button color="outline-primary" size="sm" className="ml-2" onClick={onAddEmptyFilterRow}>
                  <i className="fas fa-plus" />
                </Button>
              </div>
            )}
            </td>
          </tr>
        ))}
      </table>
      {values.length > 0 && !!watch(`field-${values[0]}`) && (
        <div className="mt-2" style={{display:'flex', flexDirection:'row', justifyContent:'space-between'}}>
          <Button color="outline-default" size="sm" type="submit">
            <i className="fas fa-check" /> Apply filter
          </Button>
          {!!currentPresetFilter && (
              <Button type="button" size="sm" color="outline-warning" onClick={() => removePresetFilter(currentPresetFilter)}>
                <i className="ni ni-basket small" /> remove {currentPresetFilter}
              </Button>
          )}
          <Form onSubmit={submitPresetFilter} className="row mt-2 ml-0 line-height-input">
            Save as:
            {renderField('text', {
              name: 'filterName',
              innerRef: register2({}),
              type: 'text',
              class: 'input-group-sm mb-0 padding-leftright ',
              setValue: setValue,
              placeholder: 'Preset name',
            })}
            <Button color="outline-default" size="sm" type="submit" disabled={!watch2('filterName')}>
              <i className="fas fa-save" />
            </Button>
          </Form>
        </div>
      )}
    </Form>
  );
};

export default inject('userStore')(observer(ListFilter));
