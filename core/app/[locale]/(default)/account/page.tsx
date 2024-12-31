import { BookUser, Settings,Package } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import { ReactNode } from 'react';

import { Link } from '~/components/link';
import Image from 'next/image';

import { AccountNotification } from './_components/account-notification';
import { WelcomeMessage } from './welcome-message';
import ordersIcon from "~/public/accountIcons/orders.svg"

interface AccountItem {
  children: ReactNode;
  description?: string;
  href: string;
  title: string;
}

const AccountItem = ({ children, title, description, href }: AccountItem) => {
  return (
    <Link
      className="flex items-center p-3 bg-[#ebebeb] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/20"
      href={href}
    >
      {children}
      <span>
        <h3 className="text-xl font-bold lg:text-2xl">{title}</h3>
        {description ? <p>{description}</p> : null}
      </span>
    </Link>
  );
};

export async function generateMetadata() {
  const t = await getTranslations('Account.Home');

  return {
    title: t('title'),
  };
}

export default function Account() {
  const t = useTranslations('Account.Home');
// me-8 sm:me-3
  return (
    <div className="mx-auto lg:mx-[120px] lg:px-12">
      <h1 className="my-8 text-3xl font-black lg:my-8 lg:text-5xl">{t('heading')}</h1>

      <AccountNotification message={t('successMessage')} />
      <WelcomeMessage />
      <div className="mb-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <AccountItem href="/account/orders" title="Orders">
          {/* <Image src={ordersIcon} alt="Orders" width={70} height={70} /> */}
          <Package className='w-6 h-6 sm:w-8 sm:h-8 md:w-12 md:h-12 lg:w-12 lg:h-12' strokeWidth={1.5} />
        </AccountItem>
        <AccountItem href="/account/addresses" title={t('addresses')}>
          <BookUser className="w-6 h-6 sm:w-8 sm:h-8 md:w-12 md:h-12 lg:w-12 lg:h-12" strokeWidth={1.5} />
        </AccountItem>
        <AccountItem href="/account/settings" title={t('settings')}>
          <Settings className="w-6 h-6 sm:w-8 sm:h-8 md:w-12 md:h-12 lg:w-12 lg:h-12" strokeWidth={1.5} />
        </AccountItem>
      </div>
    </div>
  );
}

export const runtime = 'edge';