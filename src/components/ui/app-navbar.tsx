'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { logout } from '@/redux/slices/authSlice';
import { Icons } from '@/lib/icons';
import Image from 'next/image';

const AppNavbar = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { email } = useAppSelector((state) => state.auth);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('email');
    dispatch(logout());
    router.push('/login');
  };

  return (
    <header className='bg-primary text-white shadow-lg sticky top-0 z-40'>
      <div className='container mx-auto px-4 py-4'>
        <div className='flex items-center justify-between'>
          {/* Logo */}
          <Link href='/' className='flex items-center gap-2 hover:opacity-80 transition-opacity'>
            <Image
              src='/assets/pma-logo.svg'
              width={40}
              height={40}
              alt='product-management-app-logo'
              title='product management app'
            />
            <span className='text-2xl font-bold hidden md:block'>Product Management App</span>
          </Link>

          {/* Actions */}
          <div className='flex items-center gap-4'>
            <span className='text-sm text-gray-300 hidden sm:block'>{email}</span>

            <button
              onClick={handleLogout}
              className='p-2 hover:bg-primary-light rounded-lg transition-colors'
              title='Logout'
            >
              <Icons.LogOut className='w-5 h-5 text-accent-red' />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AppNavbar;
