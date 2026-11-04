import React from 'react';
import { OSProvider } from './os/store';
import Shell from './os/Shell';

export default function App() {
  return (
    <OSProvider>
      <Shell />
    </OSProvider>
  );
}
