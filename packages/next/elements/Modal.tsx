import React, { useRef } from 'react';

import { Portal } from './Portal';
import { useClickAway } from '@pdeals/next/lib/hooks/useClickAway';

type Props = {
  id?: string;
  onClose?: () => void;
  stylesFromParent?: any;
  hideCloseButton?: boolean;
} & React.HTMLAttributes<HTMLElement>;

export const Modal: React.FunctionComponent<Props> = ({
  id = 'modal',
  className,
  onClose = () => {},
  children,
  stylesFromParent,
  hideCloseButton,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  useClickAway(modalRef, onClose);
  return (
    <>
      <Portal id={id}>
        <div className="modal-wrap">
          <div className="modal" ref={modalRef}>
            {!hideCloseButton && (
              <div className="modal-close" onClick={onClose}>
                <img src="/assets/img/x.svg" alt="" loading="lazy" />
              </div>
            )}
            {children}
          </div>
        </div>
        <div className="overlay" onClick={onClose}></div>
      </Portal>
    </>
  );
};
