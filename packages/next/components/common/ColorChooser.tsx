import React, { Component, useEffect } from 'react';
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
import { find } from 'lodash';
import { resizeImage } from '@pdeals/next/utils/helpers';

interface IProps {
  value: string;
  onChange: any;
  product: any;
  uiStore?: UiStore;
  onOpenModal?: any;
}

function ColorChooser(props: IProps) {
  const onSet = (change) => {
    props.onChange(change);
  };
  const prepareColors = () => {
    const res: any = [];
    let selected: any = null;
    props.product.product.data.colors.forEach((c: any) => {
      const found = find(props.product.colors, (r) => `${r.id}` === `${c.color}`);
      if (!found) return;
      const c2 = { id: found.id, name: found.name, image: found.image };
      if (c2.name === props.value) {
        selected = c2;
      }
      res.push(c2);
    });
    if (!selected) selected = res[0];
    return {
      colors: res,
      selectedColor: selected,
    };
  };
  const { colors, selectedColor } = prepareColors();

  useEffect(() => {
    if (!selectedColor) return;
    if (!props.value) {
      props.onChange(selectedColor.name);
    }
  }, []);
  if (!selectedColor) return null;
  return (
    <div className="color-chooser">
      <div className="colorname">{i18n.t(selectedColor.name)}</div>
      <div className="fabricsample">
        <img
          src={resizeImage(selectedColor.image, 'thumb')}
          height="100"
          style={{ cursor: 'zoom-in' }}
          onClick={() => props.onOpenModal('color:' + selectedColor.image)}
        />
      </div>
      <div className="colors-wrapper d-flex flex-row">
        {colors.map((color) => (
          <a
            className={`color ${color.id === selectedColor.id && 'color-active'}`}
            key={color.id}
            style={{ backgroundImage: `url("${resizeImage(color.image, 'thumb')}")` }}
            onClick={() => onSet(color.name)}
          ></a>
        ))}
      </div>
    </div>
  );
}

export default inject('uiStore')(observer(ColorChooser));
