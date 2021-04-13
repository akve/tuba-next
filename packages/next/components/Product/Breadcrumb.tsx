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
import {find} from 'lodash';

interface IProps {
  uiStore?: UiStore;
  type: 'product' | 'list' | 'category';
  id?: string;
  isForCollection?: boolean;
  from?: string;
}
function Breadcrumb(props: IProps) {
  const { uiStore } = props;
  const calculateBreadcrumbs = () => {
    const res: any = [];
    if (props.type === 'product') {
      const p = uiStore!.ProductDetails;
      if (p) {
        let category = p ? p.category : null;
        if (props.from) {
          category = uiStore!.getCategoryBreadcrumb(props.from) || category;
        }
        console.log('?????', props.id, props.type, props.isForCollection, category  );
        if (category) {
          if (category.parent) {
            const parent = find(uiStore!.allData.categories.rows, r => r.id === category.parent);
            if (parent) {
              res.push({
                link: `/category/${parent.code}`,
                title: i18n.t(parent.originalName || parent.name),
              });
            }
          }
          res.push({
            link: `/category/${category.code}`,
            title: i18n.t(category.originalName || category.name),
          });
        }
        res.push({
          link: `/product/${p.code}${props.from ? `?from=${props.from}` : ''}`,
          title: i18n.t(p.name),
        });
      }
    }
    if (props.type === 'category') {
        if (props.isForCollection) {
            const cat = find(uiStore!.allData.collections, r => `${r.id}` === props.id || r.code === props.id);
            if (cat) {
              res.push({
                link: `/collections/${cat.code}`,
                title: `${i18n.t('[R:Коллекция][U:Колекцiя]')}: ${i18n.t(cat.name)}`,
              });
            }
        } else {

        if (props.id !== 'featured') {
            const lastId = props.id!.indexOf('_') >0 ? props.id!.split('_').pop() : props.id;
            const cat = find(uiStore!.allData.categories.rows, r => r.code === props.id || r.code === lastId);
            if (cat) {
              if (cat.parent) {
                const parent = find(uiStore!.allData.categories.rows, r => r.id === cat.parent);
                if (parent) {
                  res.push({
                    link: `/category/${parent.code}`,
                    title: i18n.t(parent.originalName || parent.name),
                  });
                }
              }
              res.push({
                link: `/category/${cat.code}`,
                title: i18n.t(cat.originalName || cat.name),
              });
            }
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
              <a href={row.link}>{(row.title || '').replace('<br>', ': ')}</a>
            </Link>
          </span>
        ))}
      </div>
    </div>
  );
}

export default inject('uiStore')(observer(Breadcrumb));
