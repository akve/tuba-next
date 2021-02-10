import 'reflect-metadata';
import React from 'react';
import { GetServerSideProps } from 'next';

export const getServerSideProps: GetServerSideProps = async (context: any) => {
  //context.res.writeHead(302, { Location: '/404' });
  context.res.write('ok');
  context.res.end();
  return { props: {} };
};

function LiveStatusCheck() {
  return <div>LiveStatusCheck</div>;
}

export default LiveStatusCheck;
