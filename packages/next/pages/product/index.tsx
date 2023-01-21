import React, { Component, useEffect } from 'react';
import NormalLayout from '@pdeals/next/components/layouts/NormalLayout';
import { getStore } from '@pdeals/next/stores/initStore';

const IndexPage: React.FunctionComponent<any> = () => {
  // const { query } = useRouter();
  useEffect(() => {
    document.location.href = '/';
  }, []);
  const structure = {categories: {rows:[]}, collections:[]};
  getStore().uiStore.setAllData(structure);

  return (
    <NormalLayout structure={structure}>
      <div className="d-flex w-100">
        <div className="page-margin">Taking you to home page..</div>
      </div>
    </NormalLayout>
  );
};

export default IndexPage;
