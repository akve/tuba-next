import React from 'react';
import Link from '@pdeals/next/elements/NextLink';
import { inject, observer } from 'mobx-react';
import { Breadcrumb, Row, Col } from 'reactstrap';
import BreadcrumbItem from './Breadcrumb';

const Breadcrumbs = (props) => {
  const { breadCrumbs } = props.uiStore;

  const lastBreadCrumb = [...breadCrumbs.data].reverse()[0];
  const title = lastBreadCrumb ? lastBreadCrumb.title : '';

  return (
    <Row className="align-items-center py-4">
      <Col>
        <h6 className="fullcalendar-title h1 text-white d-inline-block mb-0">{breadCrumbs.title}</h6>{' '}
        <Breadcrumb className="d-none d-md-inline-block ml-lg-4" listClassName="breadcrumb-links breadcrumb-dark">
          <BreadcrumbItem
            breadcrumbData={{
              link: '/',
              icon: 'fas fa-home',
            }}
          />
          {breadCrumbs.data.map((breadCrumbProps, index) => (
            <BreadcrumbItem
              key={breadCrumbProps.title || breadCrumbProps.id}
              breadcrumbData={breadCrumbProps}
              resolvers={breadCrumbs.resolvers}
              title={title}
            />
          ))}
        </Breadcrumb>
      </Col>
    </Row>
  );
};

export default inject('uiStore')(observer(Breadcrumbs));
