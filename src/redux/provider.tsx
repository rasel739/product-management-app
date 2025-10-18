'use client';

import { Provider } from 'react-redux';

import { useEffect } from 'react';
import { setCredentials } from './slices/authSlice';
import { store } from './store';

const ReduxProvider = ({ children }: { children: React.ReactNode }) => {
  useEffect(() => {
    const token = localStorage.getItem('token');
    const email = localStorage.getItem('email');

    if (token && email) {
      store.dispatch(setCredentials({ token, email }));
    }
  }, []);

  return <Provider store={store}>{children}</Provider>;
};

export default ReduxProvider;
