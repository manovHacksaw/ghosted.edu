'use client'

import { OCConnect, OCConnectProps } from '@opencampus/ocid-connect-js';
import { ReactNode } from 'react';

interface OCConnectWrapperProps {
  children: ReactNode;
  opts: OCConnectProps['opts']; 
  sandboxMode?: boolean;
}

export default function OCConnectWrapper({ children, opts, sandboxMode }: OCConnectWrapperProps) {
  return (
    <OCConnect opts={opts} sandboxMode={sandboxMode}>
      {children}
    </OCConnect>
  );
}