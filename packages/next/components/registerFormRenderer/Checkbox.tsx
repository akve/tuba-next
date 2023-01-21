import React from 'react';
import { FormGroup, Input } from 'reactstrap';

import { registerRenderer } from './index';
import omit from 'lodash/omit';

const Checkbox = ({ class: className, name, innerRef, label, ...rest }) => {
  const normalAttributes = omit(rest, ['notEditable', 'setValue', 'initialValue', 'entityId', 'value']);

  return (
    <FormGroup className={className}>
      <label className="form-control-label form-check-inline">
        <Input
          type="checkbox"
          className="form-control-alternative"
          name={name}
          innerRef={innerRef}
          {...normalAttributes}
        />
        {label}
      </label>
    </FormGroup>
  );
};

const RegisterCheckbox = () => {
  registerRenderer('checkbox', Checkbox);
};

export default RegisterCheckbox;
