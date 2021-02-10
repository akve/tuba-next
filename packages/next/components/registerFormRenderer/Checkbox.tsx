import React from 'react';
import { FormGroup, Input } from 'reactstrap';

import { registerRenderer } from './index';

const Checkbox = ({ class: className, name, innerRef, label, ...rest}) => {
  return (
    <FormGroup className={className}>
      <label className="form-control-label form-check-inline">
        <Input type="checkbox" className="form-control-alternative" name={name} innerRef={innerRef} {...rest}/>
        {label}
      </label>
    </FormGroup>
  );
};

const RegisterCheckbox = () => {
  registerRenderer('checkbox', Checkbox);
};

export default RegisterCheckbox;
