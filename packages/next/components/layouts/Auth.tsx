import { useEffect, useRef } from 'react';
import { withRouter } from 'next/router';

const Auth = (props) => {
  const mainContent = useRef<any>({ current: {} });

  useEffect(() => {
    const doc: any = document;
    if (!doc && mainContent.current) {
      doc.documentElement.scrollTop = 0;
      doc.scrollingElement.scrollTop = 0;
      mainContent.current.scrollTop = 0;
      doc.body.classList.add('bg-default');
    }

    return () => {
      document.body.classList.remove('bg-default');
    };
  }, []);

  return (
    <div className="main-content" ref={mainContent}>
      {props.children}
    </div>
  );
};

export default withRouter(Auth);
