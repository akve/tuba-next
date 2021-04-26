import React, { useState, useEffect } from 'react';
import { FormGroup, Input } from 'reactstrap';
import ReactSelect from 'react-select';
import { CrudApi } from '@pdeals/next/lib/api/crud-api';
import debounce from 'lodash/debounce';
import { t } from '../../utils/i18n';

import { registerRenderer } from './index';

const LazyDropDown = ({
  class: className,
  label,
  name,
  options: dropdownOptions,
  setValue,
  innerRef,
  initialValue,
  placeholder,
  onChange,
  disabled,
}) => {
  const [options, setOptions] = useState([]);
  const [inputChanged, setInputChanged] = useState(false);

  const fetchOptions = debounce(async (userFilter) => {
    try {
      const { url, value, label } = dropdownOptions.resource;
      const { allowEmpty } = dropdownOptions;
      const crudOptions: any = url.indexOf('/') >= 0 ? { overrideListUrlPrefix: url } : { apiUrlPrefix: url };
      const list: any = await CrudApi(crudOptions).getObjects({
        limit: 100,
        userFilter,
      });
      const newOptions = list.rows.map((item) => ({
        value: item[value] || '',
        label: t(item[label]) || '',
      }));
      if (allowEmpty) {
        newOptions.unshift({ value: '', label: allowEmpty });
      }
      setOptions(newOptions);
    } catch (e) {
      console.log('error', e);
    }
  }, 600);

  useEffect(() => {
    if (initialValue) {
      fetchOptions([{ field: 'search', condition: 'like', value: String(initialValue) }]);
    }
  }, [initialValue]);

  const debouncedFetchOptions = (val) => {
    if (!inputChanged) setInputChanged(true);
    fetchOptions([{ field: 'search', condition: 'like', value: val }]);
  };

  const handleMenuOpen = () => {
    if (options.length > 1) return;

    if (dropdownOptions.resource) {
      fetchOptions([{ field: 'search', condition: 'like', value: '' }]);
    }
  };

  const handelSelect = (all) => {
    const { value, label } = all;
    if (dropdownOptions.alsoSetLabelTo) {
      setValue(dropdownOptions.alsoSetLabelTo, label);
    }
    setValue(name, value);
    if (onChange) onChange(name, value);
  };

  return (
    <FormGroup className={className} style={{ position: 'relative' }}>
      {label && <label className="form-control-label">{label}</label>}
      {!initialValue || options.length || inputChanged ? (
        <ReactSelect
          filterOption={(e, v) => {
            if (!v) return true;
            return e.label.toLowerCase().indexOf(v.toLowerCase()) >= 0;
          }}
          options={options}
          placeholder={placeholder || 'Select...'}
          onInputChange={debouncedFetchOptions}
          onChange={handelSelect}
          defaultValue={options.find(({ value }) => +value === +initialValue)}
          onMenuOpen={handleMenuOpen}
          isDisabled={disabled}
        />
      ) : (
        <ReactSelect key="diabled" isDisabled={disabled} onMenuOpen={handleMenuOpen} />
      )}
      <Input
        type="text"
        name={name}
        innerRef={innerRef}
        style={{
          height: 0,
          width: 0,
          position: 'absolute',
          top: '50%',
          left: '50%',
          zIndex: -1,
          transform: 'translate(-50%, 50%)',
        }}
      />
    </FormGroup>
  );
};

const RegisterLazyDropDown = () => {
  registerRenderer('lazydropdown', LazyDropDown);
};

export default RegisterLazyDropDown;
