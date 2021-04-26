import React, { Component, useEffect } from 'react';
import NormalLayout from '@pdeals/next/components/layouts/NormalLayout';

const IndexPage: React.FunctionComponent<any> = () => {
  // const { query } = useRouter();
  useEffect(() => {
    document.location.href = '/';
  }, []);
  return (
    <NormalLayout>
      <div className="d-flex w-100">
        <div className="page-margin">Taking you to home page..</div>
      </div>
    </NormalLayout>
  );
};

export default IndexPage;
