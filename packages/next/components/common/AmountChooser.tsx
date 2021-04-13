import React, { Component } from 'react';
import Link from '@pdeals/next/elements/NextLink';
import { withRouter } from 'next/router';
import classnames from 'classnames';
import PerfectScrollbar from 'react-perfect-scrollbar';
import {
  Card,
  Collapse,
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

interface IProps {
  value: number;
  onChange: any;
}

function AmountChooser(props: IProps) {
  const onSet = (change: number) => {
    if (props.value === 1 && change === -1) return;
    props.onChange(props.value + change);
  };

  return (
    <div className="amount-chooser">
      <a onClick={() => onSet(-1)}>-</a>
      <input className="form-control amount-input" type="text" value={props.value} disabled />
      <a onClick={() => onSet(1)}>+</a>
    </div>
  );
}

export default AmountChooser;
