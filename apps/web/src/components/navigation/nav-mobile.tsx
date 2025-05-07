'use server';

import { headers } from 'next/headers';
import { NavMobileClient } from './nav-mobile-client';

/**
 * @description Only renders the mobile navigation if the user is on a mobile device.
 */
export async function NavMobile() {
  const headersList = await headers();
  const userAgent = headersList.get('user-agent') || '';

  const isMobileOrTablet = /Mobile|iP(hone|od|ad)|Android|BlackBerry|IEMobile/.test(userAgent);

  if (!isMobileOrTablet) {
    return null;
  }

  return <NavMobileClient />;
}
