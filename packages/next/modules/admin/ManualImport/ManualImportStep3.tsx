import { useEffect, useState } from 'react';
import { Form, FormGroup, Label, Input, Table, Card, CardHeader, Row, Col, CardBody } from 'reactstrap';
import { useForm } from 'react-hook-form';
import dateFormat from 'date-fns/format';
import { ILookup } from '@pdeals/models/lookups/ILookup';
import {
  IMapping,
  KNOWN_DB_FIELD,
  IKnownDbField,
  KNOWN_COLS_DB_FIELDS,
  PREDEFINED_COLS,
} from '@pdeals/models/dto/ManualImportDto';
import { addNotification } from '@pdeals/next/utils/notifications';
import { AllImportCalculationFormulas } from '@pdeals/models/logic/paymentCalculations';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
interface IProps {
  data: any;
  config: any;
  onProceed: any;
  mapping: IMapping;
}

function ImportStep3(props: IProps) {
  const requiredList: any = [];
  const roomIsPreselected = props.config.room !== '';

  const formOptions = {
    defaultValues: {
      name: 'Manual import',
      for_date: dateFormat(new Date(), 'yyyy-MM-dd'),
      template: 'custom',
    },
  };
  console.log('M', props.mapping);
  const [mapping, setMapping] = useState<IMapping>(props.mapping);

  const validate = () => {
    const required = { user_id: false };
    let requiredMsg = 'Columns user and rake are required';
    if (!roomIsPreselected) {
      required['room_id'] = false;
      requiredMsg = 'Columns user, rake and room are required';
    }
    let uniqueMsg = '';
    requiredList.forEach((field) => {
      required[field.value] = false;
    });
    mapping.columns.forEach((col) => {
      if (Object.keys(required).indexOf(col.toColumn) >= 0) {
        if (required[col.toColumn]) {
          uniqueMsg = `${col.toColumn} should be unique`;
        }
        required[col.toColumn] = true;
      }
    });
    console.log('RRR', required);
    if (uniqueMsg) {
      addNotification('error', '', uniqueMsg);
      return false;
    }
    let requiredFailed = false;
    Object.keys(required).forEach((key) => {
      if (!required[key]) requiredFailed = true;
    });
    if (requiredFailed) {
      addNotification('error', '', requiredMsg);
      return false;
    }
    return true;
  };

  const handleSave = () => {
    if (validate()) {
      props.onProceed(mapping);
    }
  };
  const getFieldByName = (name: KNOWN_DB_FIELD): IKnownDbField | undefined => {
    return KNOWN_COLS_DB_FIELDS.find((r) => r.db === name);
  };

  const getMapToOptions = () => {
    const options: ILookup = {
      options: [
        { value: PREDEFINED_COLS.COPY_AS_IS, label: '* Copy as is' },
        { value: PREDEFINED_COLS.SKIP, label: '* Skip' },
      ],
    };
    requiredList.push({
      value: 'user_id',
      label: 'User',
    });
    if (!roomIsPreselected) {
      requiredList.push({
        value: 'room_id',
        label: 'Room',
      });
    }

    const formula = AllImportCalculationFormulas.find((r) => r.id === props.config.template);
    // console.log('F', formula);
    if (formula && formula.required) {
      formula.required.forEach((field) => {
        requiredList.push({
          value: field,
          label: getFieldByName(field) ? getFieldByName(field)!.name : '???',
        });
      });
    }
    KNOWN_COLS_DB_FIELDS.forEach((r) => {
      options.options!.push({ value: r.db, label: r.name });
    });
    return options;
  };
  const mapToOptions = getMapToOptions().options;
  const onMappingChange = (index, value) => {
    const newMapping: IMapping = { ...mapping };
    newMapping.columns[index].toColumn = value;
    setMapping(newMapping);
  };

  return (
    <Card className="bg-secondary shadow">
      <Form>
        <CardHeader className="bg-white border-0">
          <Row className="align-items-center">
            <Col xs="8">
              <h3 className="mb-0">Step 3: mapping</h3>
            </Col>
          </Row>
        </CardHeader>
        <CardBody>
          <div className="pl-lg-12">
            <Row>
              <Col>
                <p>Required to fill, according to formula/template:</p>
                <p>
                  <ul>{requiredList && requiredList.map((field) => <li>{field.label}</li>)}</ul>
                </p>
              </Col>
            </Row>
            <Row>
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th>From column</th>
                    <th>To column</th>
                  </tr>
                </thead>
                <tbody>
                  {mapping.columns.map((column, index) => (
                    <tr key={`${index}`}>
                      <td>{column.fromColumn}</td>
                      <td>
                        <Input
                          className="form-control-alternative"
                          name="room"
                          type="select"
                          value={column.toColumn || ''}
                          onChange={(e) => onMappingChange(index, e.target.value)}
                        >
                          {!!mapToOptions &&
                            mapToOptions.map((option) => <option value={option.value}>{option.label}</option>)}
                        </Input>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Row>
          </div>
          <div style={{ textAlign: 'center' }}>
            <a className="btn btn-primary" style={{ marginLeft: 'auto' }} onClick={() => handleSave()}>
              <i className="fa fa-arrow-right" /> Next
            </a>
          </div>
        </CardBody>
      </Form>
    </Card>
  );
}

export default ImportStep3;
