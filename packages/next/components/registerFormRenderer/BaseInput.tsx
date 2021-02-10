import React from 'react';
import { FormGroup, Input } from 'reactstrap';

import { registerRenderer } from './index';

const BaseInput = ({ class: className, label, name, innerRef, type, ...rest}) => {
  return (
    <FormGroup className={className}>
      {label && (
        <label className="form-control-label" htmlFor="input-username">
          {label}
        </label>
      )}
      <Input style={{ height: '38px' }} name={name} innerRef={innerRef} type={type} {...rest} />
    </FormGroup>
  );
};

const RegisterBaseInput = () => {
  registerRenderer('text', BaseInput);
  registerRenderer('number', BaseInput);
};

export default RegisterBaseInput;
