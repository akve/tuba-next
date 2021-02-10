import React, { useEffect, useState } from 'react';
import { FormGroup, Input } from 'reactstrap';

const DateInput = (props) => {
  const [date, setDate] = useState(props.initialValue?.split('T')[0]);

  const handleChangeDate = ({ target: { value } }) => {
    setDate(value);
  };

  useEffect(() => {
    props.setValue(props.name, date);
  }, [date]);

  return (
    <FormGroup className={props.class}>
      {props.label && <label className="form-control-label">{props.label}</label>}
      {/* UGLY: Hidden input to change form state */}
      <Input
        type="text"
        innerRef={props.innerRef}
        name={props.name}
        style={{ display: 'none' }}
        required={props.required}
      />
      <Input
        type="date"
        className="form-control-alternative"
        value={date}
        onChange={handleChangeDate}
        required={props.required}
      />
    </FormGroup>
  );
};

export { DateInput };
