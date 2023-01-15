import React, { Component, useState } from 'react';
import Link from '@pdeals/next/elements/NextLink';
import { withRouter } from 'next/router';
import classnames from 'classnames';
import PerfectScrollbar from 'react-perfect-scrollbar';
import {
  Card,
  Collapse,
  Button,
  CardBody,
  NavbarBrand,
  Navbar,
  NavItem,
  NavLink,
  Nav,
  Popover,
  PopoverHeader,
  PopoverBody,
} from 'reactstrap';
import { inject, observer } from 'mobx-react';
import UiStore from '@pdeals/next/stores/uiStore';
import * as i18n from '@pdeals/next/utils/i18n';
import { getRenderer } from '@pdeals/next/components/registerFormRenderer';
import { SizeTable } from './SizeTable';

interface IProps {
  value: string;
  onChange: any;
  onOpenModal?: any;
}

function SizeChooser(props: IProps) {
  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => setIsOpen(!isOpen);
  const options = {
    options: [
      { label: '44', value: '44' },
      { label: '46', value: '46' },
      { label: '48', value: '48' },
      { label: '50', value: '50' },
      { label: '52', value: '52' },
      { label: '54', value: '54' },
      { label: '56', value: '56' },
      { label: '58', value: '58' },
      { value: 'custom', label: i18n.t('[E:my measurements][R:По меркам][U:За моїми мірками]') },
    ],
  };

  const DropDown = getRenderer('dropdown');

  return (
    <div className="size-chooser w-100">
      <div className="d-flex flex-row">
        <DropDown
          class="mb-0"
          options={options}
          initialValue={props.value}
          value={props.value}
          onChange={(e) => props.onChange(e)}
        />
        <Button outline size="sm" className="button-smaller" onClick={toggle}>
          {i18n.t('[E:Sizes table][R:Таблица размеров][U:Таблиця розмірів]')}
        </Button>
      </div>
      <Collapse isOpen={isOpen}>
        <Card className="mt-1">
          <CardBody className="p-0">
            <SizeTable />
          </CardBody>
        </Card>
      </Collapse>
    </div>
  );
}

export default SizeChooser;
