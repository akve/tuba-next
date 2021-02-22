import React, { Component } from 'react';
import Link from 'next/link';
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
import {find} from 'lodash';

interface IProps {
  uiStore?: UiStore;
  type: 'product' | 'list';
  id?: string;
}
function Breadcrumb(props: IProps) {
  const { uiStore } = props;
  const calculateBreadcrumbs = () => {
    const res = [];
    if (props.type === 'product') {
      const p = uiStore!.ProductDetails;
      if (p) {
        if (p.category) {
          res.push({
            link: `/category/${p.category.code}`,
            title: i18n.t(p.category.name),
          });
        }
        res.push({
          link: `/product/${p.code}`,
          title: i18n.t(p.name),
        });
      }
    }
    if (props.type === 'category') {
        if (props.id !== 'featured') {
          const cat = find(uiStore!.allData.categories.rows, r => r.code === props.id);
          if (cat) {
            if (cat.parent) {
              const parent = find(uiStore!.allData.categories.rows, r => r.id === cat.parent);
              if (parent) {
                res.push({
                  link: `/category/${parent.code}`,
                  title: i18n.t(parent.name),
                });
              }
            }
            res.push({
              link: `/category/${cat.code}`,
              title: i18n.t(cat.name),
            });
          }
        }
    }
    return res;
  };
  const bc = calculateBreadcrumbs();

  return (
    <div className="breadcrumb-wrapper">
      <div className="breadcrumb">
        <Link href="/">
          <a href="/">Магазин</a>
        </Link>
        {bc.map((row: any, index) => (
          <span key={`${index}`}>
            <span>&nbsp;>&nbsp;</span>
            <Link href={row.link}>
              <a href={row.link}>{row.title}</a>
            </Link>
          </span>
        ))}
      </div>
    </div>
  );
}

export default inject('uiStore')(observer(Breadcrumb));
