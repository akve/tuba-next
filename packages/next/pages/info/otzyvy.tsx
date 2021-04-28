import React, { Component } from 'react';
import dynamic from 'next/dynamic';
import Link from '@pdeals/next/elements/NextLink';
import { client } from '../../lib/api/api-client';
import { getStore } from '@pdeals/next/stores/initStore';
import NormalLayout from '@pdeals/next/components/layouts/NormalLayout';
import { inject, observer } from 'mobx-react';
import * as i18n from '@pdeals/next/utils/i18n';
import Snippet from '@pdeals/next/components/Snippet/Snippet';
import { formatDate } from '@pdeals/next/utils/dateFormat';
//import Quote from '../../assets/img/quote.svg';
import Plus from '@pdeals/next/assets/img/plus.svg';
import StarsRating from 'react-rating';

export async function getServerSideProps(context) {
  const alldata = await client().get('/open/alldata');
  const reviews = await client().get('/open/reviews-frontend/0');
  return {
    props: { alldata, reviews }, // will be passed to the page component as props
  };
}

const CheckoutPage: React.FunctionComponent<any> = ({ uiStore, alldata, reviews }) => {
  // const { query } = useRouter();
  uiStore.setAllData(alldata);
  const calcDate = (d) => {
    return formatDate(d);
  };
  return (
    <NormalLayout>
      <div className="d-flex w-100">
        <div className="page-margin">
          <Snippet code={'otzyvy'} />
        </div>
      </div>
      {!!reviews && (
        <div className="reviews-list">
          {reviews.rows.map((r) => (
            <div className="review">
              <div className="review--left">
                <div className="review--name">{r.username}</div>
                <div className="review--stars">
                  <StarsRating
                    onChange={() => {}}
                    className={'smaller'}
                    initialRating={r.score || 5}
                    readonly={true}
                    emptySymbol={
                      <img
                        src="/assets/img/rating/empty.svg"
                        width="20"
                        height="19"
                        className="icon"
                        alt=""
                        loading="lazy"
                      />
                    }
                    fullSymbol={
                      <img
                        src="/assets/img/rating/full.svg"
                        width="20"
                        height="19"
                        className="icon"
                        alt=""
                        loading="lazy"
                      />
                    }
                  />
                </div>
                <div className="review--date">{calcDate(r.score_date || r.createdDate)}</div>
              </div>
              <div className="review--right">
                <img src="/assets/img/quote.svg" style={{ width: '30px', height: '30px' }} />
                <div className="review--content" dangerouslySetInnerHTML={{ __html: r.description }} />
              </div>
            </div>
          ))}
        </div>
      )}{' '}
    </NormalLayout>
  );
};

export default inject('uiStore')(observer(CheckoutPage));
