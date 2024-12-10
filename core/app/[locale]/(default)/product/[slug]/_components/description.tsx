import { useTranslations } from 'next-intl';

import { FragmentOf, graphql } from '~/client/graphql';

export const DescriptionFragment = graphql(`
  fragment DescriptionFragment on Product {
    description
  }
`);

interface Props {
  product: FragmentOf<typeof DescriptionFragment>;
}

export const Description = ({ product }: Props) => {
  const t = useTranslations('Product.Description');

  if (!product.description) {
    return null;
  }

  return (
    <>
    <iframe
                id="player"
                class="lazyload"
                type="text/html"
                width="640"
                height="390"
                frameborder="0"
                webkitAllowFullScreen
                mozallowfullscreen
                allowFullScreen
                data-src="//www.youtube.com/embed/{{this.featured.id}}?rel=0"
                data-video-player>
            </iframe>

      <h2 className="mb-4 text-xl font-bold md:text-2xl">{t('heading')}</h2>
      <div dangerouslySetInnerHTML={{ __html: product.description }} />
    </>
  );
};
