import { useEffect, useState } from 'react';
import { Form, FormGroup, Label, Input, Table, Card, CardHeader, Row, Col, CardBody } from 'reactstrap';
import { useForm } from 'react-hook-form';
import dateFormat from 'date-fns/format';
import { client } from '@pdeals/next/lib/api/api-client';
import { inject, observer } from 'mobx-react';
import RoomsStore from '@pdeals/next/stores/roomsStore';
import { AllImportCalculationFormulas } from '@pdeals/models/logic/paymentCalculations';
import { getCurrencies } from '@pdeals/next/lib/services/currencyService';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
interface IProps {
  onProceed: any;
  roomsStore?: RoomsStore;
}

function ImportStep2(props: IProps) {
  const formOptions = {
    defaultValues: {
      name: 'Manual import',
      for_date: dateFormat(new Date(), 'yyyy-MM-dd'),
      template: 'basic',
      room: '',
      defaultCurrency: 'USD',
    },
  };
  const [currencies, setCurrencies] = useState<any>(null);
  const [roomOptions, setRoomOptions] = useState<any>(null);
  const [templates, setTemplates] = useState<any>(null);
  const { register: register1, handleSubmit: handleSubmit1, setValue, watch } = useForm(formOptions);

  const fetchExtraData = async () => {
    if (!currencies) {
      setCurrencies(await getCurrencies());
    }
    if (!roomOptions) {
      const rooms = await props.roomsStore!.getRooms();
      const roomList = [{ value: '', label: 'Multiple rooms' }];
      rooms.forEach((room) => roomList.push({ value: room.id, label: room.name }));
      setRoomOptions(roomList);
    }
  };
  useEffect(() => {
    fetchExtraData();
    setTemplates(
      AllImportCalculationFormulas.map((formula) => {
        return { value: formula.id, label: formula.name };
      })
    );
  }, []);

  const handleSave = () => {
    handleSubmit1(handleSaveInternal)();
  };

  const handleSaveInternal = (values) => {
    props.onProceed(values);
  };

  return (
    <Card className="bg-secondary shadow">
      <Form>
        <CardHeader className="bg-white border-0">
          <Row className="align-items-center">
            <Col xs="8">
              <h3 className="mb-0">Step 2: configure your import</h3>
            </Col>
          </Row>
        </CardHeader>
        <CardBody>
          <div className="pl-lg-12">
            <Row>
              <Col xs="12">
                <FormGroup>
                  <label className="form-control-label" htmlFor="input-name">
                    Name
                  </label>
                  <Input
                    className="form-control-alternative"
                    name="name"
                    innerRef={register1({ required: true })}
                    type="text"
                  />
                </FormGroup>
              </Col>
              <Col xs="12">
                <FormGroup>
                  <label className="form-control-label" htmlFor="input-for_date">
                    For date
                  </label>
                  <Input
                    className="form-control-alternative"
                    name="for_date"
                    innerRef={register1({ required: true })}
                    type="date"
                  />
                </FormGroup>
              </Col>
              <Col xs="12">
                <FormGroup>
                  <label className="form-control-label" htmlFor="input-template">
                    Formula
                  </label>
                  <Input className="form-control-alternative" name="template" innerRef={register1({})} type="select">
                    {!!templates && templates.map((option) => <option value={option.value}>{option.label}</option>)}
                  </Input>
                </FormGroup>
              </Col>
              <Col xs="12">
                <FormGroup>
                  <label className="form-control-label" htmlFor="input-template">
                    For group
                  </label>
                  <Input className="form-control-alternative" name="room" innerRef={register1({})} type="select">
                    {!!roomOptions && roomOptions.map((option) => <option value={option.value}>{option.label}</option>)}
                  </Input>
                </FormGroup>
              </Col>
              <Col xs="12">
                <FormGroup>
                  <label className="form-control-label" htmlFor="input-template">
                    Default currency
                  </label>
                  <Input
                    className="form-control-alternative"
                    name="defaultCurrency"
                    innerRef={register1({})}
                    type="select"
                  >
                    {!!currencies && currencies.map((option) => <option value={option.code}>{option.name}</option>)}
                  </Input>
                </FormGroup>
              </Col>
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

export default inject('roomsStore')(observer(ImportStep2));
