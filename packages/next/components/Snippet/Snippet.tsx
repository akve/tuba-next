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
import { find } from 'lodash';
import { t } from '../../utils/i18n';
import OutsideClickHandler from 'react-outside-click-handler';
import UiStore from '@pdeals/next/stores/uiStore';
import * as i18n from '@pdeals/next/utils/i18n';

interface IProps {
  uiStore?: UiStore;
  code: string;
}
function Snippet(props: IProps) {
  const { uiStore } = props;
  const snippet = find(uiStore?.allData.snippets, (r) => r.code === props.code);
  if (!snippet) return null;
  const lang = i18n.currentLang();
  const content = snippet['content_' + lang];

  return <div className="snippet" dangerouslySetInnerHTML={{ __html: content }}></div>;
}

// Sidebar.defaultProps = {
//   routes: [{}],
//   toggleSidenav: () => {},
//   sidenavOpen: false,
//   rtlActive: false,
// };

export default inject('uiStore')(observer(Snippet));
