import React, { useState, useEffect, useCallback, useRef } from 'react';
// import dynamic from 'next/dynamic';
import { FormGroup, Input } from 'reactstrap';

import dynamic from 'next/dynamic';

const importJodit = () => import('jodit-react');

const JoditEditor = dynamic(importJodit, {
  ssr: false,
});

import { registerRenderer } from './index';

const TextRedactor = (props) => {
  const editor = useRef(null);
  const [content, setContent] = useState(props.initialValue);

  // const [reactQuillText, setReactQuillText] = useState(props.initialValue);

  /*useEffect(() => {
    props.setValue(props.name, reactQuillText);
  }, [reactQuillText]);*/

  /*const config = {
    readonly: false, // all options from https://xdsoft.net/jodit/doc/
  };*/

  return (
    <FormGroup className={props.class}>
      <label className="form-control-label">{props.label}</label>
      {/* UGLY: Hidden input to change form state */}
      <Input innerRef={props.innerRef} name={props.name} type="text" style={{ display: 'none' }} />
      {typeof window !== 'undefined' && (
        <JoditEditor
          ref={editor}
          value={content}
          onBlur={(newContent) => {
            console.log('NC', newContent);
            setContent(newContent);
            props.setValue(props.name, newContent);
          }} // preferred to use only this option to update the content for performance reasons
          onChange={(newContent) => {
            // props.setValue(props.name, newContent);
          }}
        />
      )}
      {/*<ReactQuill
        value={reactQuillText || ''}
        onChange={handleReactQuillChange}
        theme="snow"
        modules={{
          toolbar: [
            ['bold', 'italic'],
            ['link', 'blockquote', 'code', 'image'],
            [
              {
                list: 'ordered',
              },
              {
                list: 'bullet',
              },
            ],
          ],
        }}
      />*/}
    </FormGroup>
  );
};

const RegisterTextRedactor = () => {
  registerRenderer('html', TextRedactor);
};

export default RegisterTextRedactor;
