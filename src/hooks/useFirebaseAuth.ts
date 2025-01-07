'use client';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { login, logout } from '../redux/auth';
import { auth } from '../utils/firebase';
import api from '../utils/axios';

const useFirebaseAuth = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user && user.email) {
        const response = await api.get('/user/me/data');
        const role = response.data.role;
        dispatch(login({ id: user.uid, email: user.email, name: user.displayName, role }));
      } else {
        dispatch(logout());
      }
    });

    return () => unsubscribe();
  }, [dispatch]);

  return null;
};

export default useFirebaseAuth;
