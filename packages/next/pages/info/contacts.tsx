import React, { Component } from 'react';
import dynamic from 'next/dynamic';
import Link from '@pdeals/next/elements/NextLink';
import { client } from '../../lib/api/api-client';
import { getStore } from '@pdeals/next/stores/initStore';
import NormalLayout from '@pdeals/next/components/layouts/NormalLayout';
import { inject, observer } from 'mobx-react';
import * as i18n from '@pdeals/next/utils/i18n';
import Snippet from '@pdeals/next/components/Snippet/Snippet';
import { serverSetLang, serverTranslate } from '@pdeals/next/lib/utils/serverTranslate';
import { currentLang, setLang } from '@pdeals/next/utils/i18n';

export async function getServerSideProps(context) {
  serverSetLang(context);

  const structure = await client().get('/open/structure/structure');
  const content = await client().get('/open/structure/snippets');
  return {
    props: { lang: currentLang(), structure: serverTranslate(context, structure), content }, // will be passed to the page component as props
  };
}

const CheckoutPage: React.FunctionComponent<any> = ({ lang, uiStore, structure, content }) => {
  // const { query } = useRouter();
  setLang(lang);
  uiStore.setAllData(structure);
  uiStore.setSnippets(content);
  return (
    <NormalLayout structure={structure}>
      <div className="d-flex w-100">
        <div className="page-margin">
          <Snippet code={'contacts'} />
        </div>
      </div>
    </NormalLayout>
  );
};

export default inject('uiStore')(observer(CheckoutPage));
