import React from 'react';
import { createPortal } from 'react-dom';
import { usePortal } from '@pdeals/next/lib/hooks/usePortal';

type Props = {
  id: string;
};

export const Portal: React.FunctionComponent<Props> = ({ id, children }) => {
  const target = usePortal(id);

  return createPortal(children, target);
};
