import React, { useState, useEffect } from 'react';
import { FormGroup, Input } from 'reactstrap';
import ReactSelect from 'react-select';
import { CrudApi } from '@pdeals/next/lib/api/crud-api';
import debounce from 'lodash/debounce';
import { t } from '../../utils/i18n';

import { getRenderer, registerRenderer } from './index';
import { IFormField } from '@pdeals/next/components/Crud/ICrud';
import { useForm } from 'react-hook-form';

const SmartList = ({
  class: className,
  label,
  name,
  fieldSpecificParams: listOptions,
  value,
  setValue,
  innerRef,
  placeholder,
  disabled,
}) => {
  const formOptions = {
    defaultValues: listOptions.initialData,
  };
  const { register: register1, handleSubmit: handleSubmit1, setValue: setValue1, watch, reset, ...rest } = useForm(
    formOptions
  );

  const renderField = (field: IFormField, index: number) => {
    const fieldClass = `${field.class || ''}`;
    if (field.type === 'heading') {
      return (
        <h6 key={`heading/${index}`} className="heading-small text-muted mb-4" style={{ width: '100%' }}>
          {field.label}
        </h6>
      );
    }

    const watchedValue = watch(field.name);
    if (field.type === 'custom' && field.component) {
      const { component: Component, ...fieldPprops } = field;
      return (
        <Component
          {...fieldPprops}
          name={fieldPprops.name}
          key={field.name + index}
          innerRef={register1({})}
          setValue={setValue}
          value={watchedValue}
          initialValue={listOptions.initialData[field.name]}
        />
      );
    }

    const Component = getRenderer(field.type);
    return Component ? (
      <Component
        key={field.name + index}
        {...field}
        class={fieldClass}
        innerRef={register1({})}
        setValue={setValue1}
        value={watchedValue}
        initialValue={listOptions.initialData[field.name]}
      />
    ) : null;
  };

  const renderForm = (fields: IFormField[]) => {
    return (
      <>
        {fields.map((field, index) => renderField(field, index))}
        <a onClick={() => onAddRow()}>Add</a>
      </>
    );
  };
  const onRemoveRow = (index) => {
    const v = value ? [...value] : [];
    v.splice(index, 1);
    setValue(name, v);
  };
  const onAddRow = () => {
    handleSubmit1((values) => {
      const v = value ? [...value] : [];
      v.push(values);
      setValue(name, v);
    })();
  };
  const renderList = () => {
    if (!value || !value.length) return null;
    return (
      <table>
        {value.map((row, index) => (
          <tr key={`${index}`}>
            {listOptions.columns.map((col, colIndex) => (
              <td key={`${colIndex}`}>{row[col.name]}</td>
            ))}
            <td>
              <a onClick={() => onRemoveRow(index)}>[x]</a>
            </td>
          </tr>
        ))}
      </table>
    );
  };

  return (
    <FormGroup className={className} style={{ position: 'relative' }}>
      {label && <label className="form-control-label">{label}</label>}
      {renderList()}
      {renderForm(listOptions.fields)}
    </FormGroup>
  );
};

const RegisterSmartList = () => {
  registerRenderer('smartlist', SmartList);
};

export default RegisterSmartList;
