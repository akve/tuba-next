import { useState } from 'react';
import {
  Input,
  Button,
  ButtonGroup,
  Modal,
  Row,
  Col,
  Table,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from 'reactstrap';

import { CrudApi } from '@pdeals/next/lib/api/crud-api';

export interface IActionProps {
  data: any;
  params: any;
  callbacks: { [key: string]: () => void };
}

export const MessageUser = (props: IActionProps) => {
  const [value, setValue] = useState('');

  const handleChangeValue = ({ target: { value } }) => setValue(value);

  const handleSubmit = (event) => {
    event.preventDefault();
    setValue('');
  };

  return (
    <ButtonGroup>
      <Input type="text" placeholder="Send message" value={value} onChange={handleChangeValue} />
      <Button className="buttons-copy buttons-html5" color="default" size="sm" type="button" onClick={handleSubmit}>
        Send
      </Button>
    </ButtonGroup>
  );
};

export const Copy = () => {
  return (
    <Button className="buttons-copy buttons-html5" color="default" size="sm">
      Copy
    </Button>
  );
};

export const Print = () => {
  return (
    <Button className="buttons-copy buttons-html5" color="default" size="sm">
      Print
    </Button>
  );
};
