'use server';

import { cookies } from 'next/headers';

export async function loginAction(formData: FormData) {
  const email = formData.get('email');
  const password = formData.get('password');

  if (email === 'admin@example.com' && password === '123456') {
    (await cookies()).set('auth', 'valid', {
      httpOnly: true,
      path: '/',
    });

    return {
      id: '1',
      name: 'Admin',
      email: email as string,
    };
  }

  return null;
}
