import React, { useEffect, useState } from 'react';
import Safe from 'react-safe';

const MarketingTrackers = () => {
  const [shown, setShown] = useState<boolean>(false);
  useEffect(() => {
    setTimeout(() => {
      return;
      //setShown(true);
      console.log('!!!!!');
      // window.eval(`
      // !function(f,b,e,v,n,t,s)
      //       {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
      //         n.callMethod.apply(n,arguments):n.queue.push(arguments)};
      //         if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
      //         n.queue=[];t=b.createElement(e);t.async=!0;
      //         t.src=v;s=b.getElementsByTagName(e)[0];
      //         s.parentNode.insertBefore(t,s)}(window, document,'script',
      //       'https://connect.facebook.net/en_US/fbevents.js');
      //       fbq('init', '366138666843162');
      //       fbq('track', 'PageView');`);
      window.eval(`window.fbAsyncInit = function() {
          FB.init({
            xfbml            : true,
            version          : 'v10.0'
          });
        };

          (function(d, s, id) {
          var js, fjs = d.getElementsByTagName(s)[0];
          if (d.getElementById(id)) return;
          js = d.createElement(s); js.id = id;
          js.src = 'https://connect.facebook.net/ru_RU/sdk/xfbml.customerchat.js';
          fjs.parentNode.insertBefore(js, fjs);
        }(document, 'script', 'facebook-jssdk'));`);
    }, 1000);
  }, []);
  return (
    <>
      <div id="fb-root"></div>
      <div
        dangerouslySetInnerHTML={{
          __html: `<div class="fb-customerchat" attribution="setup_tool" page_id="785826554851503"></div>`,
        }}
      />


    </>
  );
};

export { MarketingTrackers };
