import React from 'react';
import { FormGroup } from 'reactstrap';

import { registerRenderer } from './index';

const Radio = ({ class: className, id, name, innerRef, onChange, label, ...rest}) => {
  const handleChange = (event) => {
    if (onChange) onChange(name, event.target.checked);
  };

  return (
    <FormGroup className={className}>
      <div className="custom-control custom-radio h-100 mr-4">
        <input
          className="custom-control-input"
          id={id || name}
          name={name}
          onChange={handleChange}
          ref={innerRef}
          type="radio"
          {...rest}
        />
        <label
          className="custom-control-label"
          htmlFor={id || name}
        >
          {label}
        </label>
      </div>
    </FormGroup>
  );
};

const RegisterRadio = () => {
  registerRenderer('radio', Radio);
};

export default RegisterRadio;
