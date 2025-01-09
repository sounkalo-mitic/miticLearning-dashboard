
'use client';
import { Provider } from 'react-redux';
import store from '@/redux/store';
import LoginForm from './forms/LoginForm/page';

export default function Home() {
  return (
    <Provider store={store}>
      <LoginForm />
    </Provider>
  );
}
