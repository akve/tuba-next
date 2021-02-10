import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { FormGroup, Row, Input, Button } from 'reactstrap';
import { getRenderer } from '@pdeals/next/components/registerFormRenderer/index';
import { counterCreater } from '@pdeals/next/utils/helpers';

const count = counterCreater();

export const ReferralRequests = (props) => {
  const [values, setValues] = useState<number[]>([]);
  const { register, setValue, watch, getValues } = useForm();

  useEffect(() => {
    setTimeout(() => {
      let referralRequests = props.value || [];
      if (typeof referralRequests === 'object') {
        const value = JSON.stringify(referralRequests);
        props.setValue(props.name, value);
      } else {
        referralRequests = JSON.parse(referralRequests || []);
      }

      const ids = referralRequests.map(() => count());
      setValues(ids);
      referralRequests.forEach((request: any, index) => {
        setValue(`child-${ids[index]}`, request.child);
        setValue(`room-${ids[index]}`, request.room);
        setValue(`status-${ids[index]}`, request.status);
        setValue(`email-${ids[index]}`, request.email);
      });
    }, 0);
  }, []);

  const getNormalizedRequestsData = () => {
    const formValues = getValues();
    const fieldsIndex = Object.keys(formValues)
      .filter((key) => key.includes('child-') && formValues[key])
      .map((key) => key.split('-')[1])
      .filter(id => values.includes(+id));
    const requests = fieldsIndex
      .map((ind) => ({
        child: formValues[`child-${ind}`],
        room: formValues[`room-${ind}`],
        status: formValues[`status-${ind}`],
        email: formValues[`email-${ind}`],
      }))
      .filter(({ child, room }) => child && room);

    return requests;
  };

  const updateData = () => {
    const requestData = getNormalizedRequestsData();
    props.setValue(props.name, JSON.stringify(requestData));
  };

  const handleChangeStatus = () => {
    updateData();
  };

  const handleChangeDropdown = () => {
    updateData();
  };

  const onRemoveRequestRow = (index: number) => {
    setValues((prevValues) => prevValues.filter((val) => val !== index));
  };

  const onAddEmptyRequestRow = () => {
    const key = count();
    setValues((prevValues) => [...prevValues, key]);
    setTimeout(() => {
      setValue(`status-${key}`, 'pending');
    }, 0);
  };

  const LazyDropDownComponent = getRenderer('lazydropdown');
  const DropDownComponent = getRenderer('dropdown');
  const TextComponent = getRenderer('text');

  return (
    <div className={props.class}>
      <h6 className="heading-small text-muted mb-4" style={{ width: '100%' }}>Requests list</h6>
      {values.map((key) => (
        <Row className="align-items-center">
          <React.Fragment key={key}>
            <TextComponent
              class="col-lg-3"
              label="Child username"
              name={`child-${key}`}
              innerRef={register({})}
              initialValue={+watch(`child-${key}`)}
              onChange={handleChangeDropdown}
              disabled={props.isEdit}
              required
            />
            <TextComponent
              class="col-lg-3"
              label="Email"
              name={`email-${key}`}
              innerRef={register({})}
              initialValue={+watch(`email-${key}`)}
              onChange={handleChangeDropdown}
              disabled={props.isEdit}
            />
            {props.isEdit && watch(`room-${key}`) && (<Button
              color="outline-primary"
              className="ml-3 mr-0"
              title="View room"
              size="sm"
              type="button"
              href={`/admin/rooms/${watch(`room-${key}`)}/edit`}
            >
              <i className="ni ni-money-coins" />
            </Button>)}
            <LazyDropDownComponent
              class="col-lg-2"
              label="Room"
              disabled={props.isEdit}
              name={`room-${key}`}
              setValue={setValue}
              innerRef={register({})}
              initialValue={+watch(`room-${key}`)}
              onChange={handleChangeDropdown}
              options={{
                resource: {
                  url: '/lookups/rooms',
                  value: 'id',
                  label: 'name',
                },
              }}
            />
            <DropDownComponent
              innerRef={register({})}
              class="col-lg-2"
              disabled={!props.isEdit}
              label="Status"
              name={`status-${key}`}
              onChange={handleChangeStatus}
              options={{ options: [
                { value: 'pending', label: 'Pending' },
                { value: 'confirmed', label: 'Confirmed' },
                { value: 'declined', label: 'Declined' },
              ]}}
            />
            {!props.isEdit && (
              <Button
                color="outline-warning"
                className="ml-3"
                onClick={() => onRemoveRequestRow(key)}
                size="sm"
                type="button"
              >
                <i className="fas fa-trash" />
              </Button>
            )}
          </React.Fragment>
        </Row>
      ))}
      {!props.isEdit && (
        <Button type="button" color="outline-primary" size="sm" className="mb-2" onClick={onAddEmptyRequestRow}>
          <i className="fas fa-plus" />
        </Button>
      )}

      <Input
        type="text"
        innerRef={props.innerRef}
        name={props.name}
        style={{ display: 'none' }}
      />
    </div>
  );
};
