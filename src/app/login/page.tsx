'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useLoginMutation } from '@/redux/api/apiSlice';
import { useAppDispatch } from '@/redux/hooks';
import { setCredentials } from '@/redux/slices/authSlice';
import { validateEmail } from '@/utils/validation';
import FormInput from '@/components/ui/form-input';
import Button from '@/components/ui/button';
import { Icons } from '@/lib/icons';

const Login = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [login, { isLoading }] = useLoginMutation();

  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    const emailError = validateEmail(email);
    if (emailError) {
      setError(emailError);
      return;
    }

    try {
      const response = await login({ email }).unwrap();

      localStorage.setItem('token', response.token);
      localStorage.setItem('email', email);

      dispatch(setCredentials({ token: response.token, email }));

      router.push('/');
    } catch (error: unknown) {
      let errorMessage = 'Failed to login. Please try again.';

      const err = error as { data?: { message?: string } };
      errorMessage = err.data?.message || errorMessage;

      setError(errorMessage);
    }
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-primary via-accent-green to-primary flex items-center justify-center p-4'>
      <div className='bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md'>
        <div className='flex items-center justify-center mb-8'>
          <div className='bg-accent-green p-4 rounded-full'>
            <Icons.User className='w-12 h-12 text-white' />
          </div>
        </div>
        <h1 className='text-3xl font-bold text-center text-primary mb-2'>Welcome Back</h1>
        <p className='text-center text-gray-600 mb-8'>Sign in to manage your products</p>
        <form onSubmit={handleSubmit} className='space-y-6'>
          <FormInput
            type='email'
            label='Email Address'
            placeholder='Enter your email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={error}
            autoComplete='email'
            autoFocus
          />

          <Button type='submit' variant='primary' className='w-full' isLoading={isLoading}>
            Sign In
          </Button>
        </form>
        <p className='mt-6 text-center text-sm text-gray-600'>
          Enter your email address to get started
        </p>
      </div>
    </div>
  );
};

export default Login;
