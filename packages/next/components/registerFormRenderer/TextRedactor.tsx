import React, { useState, useEffect, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { FormGroup, Input } from 'reactstrap';

const ReactQuill = dynamic(
  import('react-quill'),
  {
    ssr: false,
    loading: () => <span>...</span>,
  }
);

import { registerRenderer } from './index';

const TextRedactor = (props) => {
  const [reactQuillText, setReactQuillText] = useState(props.initialValue);

  const handleReactQuillChange = useCallback((value) => {
    setReactQuillText(value);
  }, []);

  useEffect(() => {
    props.setValue(props.name, reactQuillText);
  }, [reactQuillText]);

  return (
    <FormGroup className={props.class}>
      <label className="form-control-label">
        {props.label}
      </label>
      {/* UGLY: Hidden input to change form state */}
      <Input innerRef={props.innerRef} name={props.name} type="text" style={{ display: 'none' }} />
      <ReactQuill
        value={reactQuillText || ''}
        onChange={handleReactQuillChange}
        theme="snow"
        modules={{
          toolbar: [
            ["bold", "italic"],
            ["link", "blockquote", "code", "image"],
            [
              {
                list: "ordered",
              },
              {
                list: "bullet",
              },
            ],
          ],
        }}
      />
    </FormGroup>
  );
};

const RegisterTextRedactor = () => {
  registerRenderer('html', TextRedactor);
};

export default RegisterTextRedactor;
