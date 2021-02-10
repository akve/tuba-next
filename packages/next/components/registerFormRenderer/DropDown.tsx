import React, { useState, useEffect } from 'react';
import { FormGroup, Input } from 'reactstrap';
import { CrudApi } from '@pdeals/next/lib/api/crud-api';

import { registerRenderer } from './index';

const DropDown = ({ class: className, label, name, onChange, innerRef, options: dropdownOptions, initialValue, disabled }) => {
  const [fetchedOptions, setFetchedOptions] = useState([]);

  useEffect(() => {
    const fetchOptions = async () => {
      const { url, value, label } = dropdownOptions.resource;
      const list: any = await CrudApi({ apiUrlPrefix: url } as any).getObjects();
      const options = list.rows.map((item) => ({
        value: item[value] || '',
        label: item[label] || '',
      }))
      setFetchedOptions(options);
    };

    if (dropdownOptions.resource) fetchOptions();
  }, []);

  const handleChange = (event) => {
    if (onChange) onChange(event?.target?.value);
  };

  const options = dropdownOptions.options
    ? dropdownOptions.options
    : fetchedOptions;
  return (
    <FormGroup className={className}>
      {label && (
        <label className="form-control-label">
          {label}
        </label>
      )}
      <Input onChange={handleChange} disabled={disabled} type="select" name={name} innerRef={innerRef} style={{ height: '38px' }}>
        {options.map((option) => (
          <option key={option.label} value={option.value} selected={option.value === initialValue}>
            {option.label}
          </option>
        ))}
      </Input>
    </FormGroup>
  );
};

const RegisterDropDown = () => {
  registerRenderer('dropdown', DropDown);
};

export default RegisterDropDown;
