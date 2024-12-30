import { removeEdgesAndNodes } from '@bigcommerce/catalyst-client';
import { useTranslations } from 'next-intl';

import { FragmentOf } from '~/client/graphql';
import { Button } from '~/components/ui/button';

import { Link } from '../../link';

import { Form } from './form';
import { AddToCartFragment } from './fragment';

interface Props {
  data: FragmentOf<typeof AddToCartFragment>;
}

export const AddToCart = ({ data: product }: Props) => {
  const t = useTranslations('Components.ProductCard.AddToCart');

  const productOptions = removeEdgesAndNodes(product.productOptions);

  return Array.isArray(productOptions) && productOptions.length > 0 ? (
    <Button asChild>
      <Link className="mt-2 hover:text-white bg-[#07265e] border-[#07265e] hover:border-[#e0af06] hover:bg-[#e0af06]" href={product.path}>
        {t('viewOptions')}
      </Link>
    </Button>
  ) : (
    <Form data={product} />
  );
};
