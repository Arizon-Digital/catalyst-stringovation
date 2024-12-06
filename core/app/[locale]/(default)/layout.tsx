import { setRequestLocale } from 'next-intl/server';
import { PropsWithChildren, Suspense } from 'react';

import { Footer } from '~/components/footer/footer';
import { Header, HeaderSkeleton } from '~/components/header';
import { Cart } from '~/components/header/cart';
import { LocaleType } from '~/i18n/routing';

interface Props extends PropsWithChildren {
  params: { locale: LocaleType };
}

export default function DefaultLayout({ children, params: { locale } }: Props) {
  setRequestLocale(locale);

  return (
    <>
    <script type="text/javascript" src="https://static.affiliatly.com/bigcommerce/v3/bigcommerce.js?affiliatly_code=AF-1070207"></script>
      <Suspense fallback={<HeaderSkeleton />}>
        <Header cart={<Cart />} />
      </Suspense>

      <main className="flex-1 px-4 2xl:container sm:px-10 lg:px-12 2xl:mx-auto 2xl:px-0">
        {children}
      </main>

      <Suspense>
        <Footer />
      </Suspense>
    </>
  );
}
