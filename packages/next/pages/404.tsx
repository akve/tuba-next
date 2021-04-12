import React, { Component } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { client } from '../lib/api/api-client';
import { getStore } from '@pdeals/next/stores/initStore';
import NormalLayout from '@pdeals/next/components/layouts/NormalLayout';
import { inject, observer } from 'mobx-react';
import * as i18n from '@pdeals/next/utils/i18n';
import Snippet from '@pdeals/next/components/Snippet/Snippet';

const NoPage: React.FunctionComponent<any> = () => {
  // const { query } = useRouter();
  return (
    <NormalLayout>
      <div className="w-100" style={{ textAlign: 'center' }}>
        <h1 style={{ width: '100%' }}>404: сторінка не знайдена</h1>
        Вибачте, щось пішло не так. Розпочніть з початку :(
      </div>
    </NormalLayout>
  );
};

export default NoPage;
