import { removeEdgesAndNodes } from '@bigcommerce/catalyst-client';
import { useFormatter, useTranslations } from 'next-intl';

import { PricingFragment } from '~/client/fragments/pricing';
import { ProductItemFragment } from '~/client/fragments/product-item';
import { FragmentOf, graphql } from '~/client/graphql';

import { ProductForm } from './product-form';
import { ProductFormFragment } from './product-form/fragment';
import { ProductSchema, ProductSchemaFragment } from './product-schema';
import { ReviewSummary, ReviewSummaryFragment } from './review-summary';

export const DetailsFragment = graphql(
  `
    fragment DetailsFragment on Product {
      ...ReviewSummaryFragment
      ...ProductSchemaFragment
      ...ProductFormFragment
      ...ProductItemFragment
      entityId
      name
      sku
      upc
      minPurchaseQuantity
      maxPurchaseQuantity
      condition
      weight {
        value
        unit
      }
      availabilityV2 {
        description
      }
      customFields {
        edges {
          node {
            entityId
            name
            value
          }
        }
      }
      brand {
        name
      }
      ...PricingFragment
    }
  `,
  [
    ReviewSummaryFragment,
    ProductSchemaFragment,
    ProductFormFragment,
    ProductItemFragment,
    PricingFragment,
  ],
);
type Field = 'SKU' | 'Brands' | 'ProdType' | 'Instrument' | 'SubBrand' | 'Style' | 'Instrument';
interface BrandFields {
  [brand: string]: Field[];
}
interface Props {
  product: FragmentOf<typeof DetailsFragment>;
}

export const Details = ({ product }: Props) => {
  const t = useTranslations('Product.Details');
  const format = useFormatter();

  const customFields = removeEdgesAndNodes(product.customFields);

  const brandFields: BrandFields = {
    'Thomastik-Infeld': ['SKU', 'Brands', 'SubBrand', 'ProdType', 'Instrument'],
    Boveda: ['SKU', 'Brands', 'ProdType', 'Instrument'],
    Jargar: ['SKU', 'Brands', 'SubBrand', 'ProdType', 'Instrument'],
    'Magic Rosin': ['SKU', 'Brands', 'SubBrand', 'ProdType', 'Instrument', 'Style'],
    Realist: ['SKU', 'Brands', 'SubBrand', 'ProdType', 'Instrument'],
    Revelle: ['SKU', 'Brands', 'SubBrand', 'ProdType', 'Instrument', 'Style'],
  };

  const getFieldsForBrand = (brand: string): Field[] => {
    return brandFields[brand] || []; //empty array if brand not found
  };

  const brand = customFields.find((each) => each.name === 'Brands')?.value ?? 'null';
  const fieldsToRender = getFieldsForBrand(brand);
  // //console.log(brand);

  const showPriceRange =
    product.prices?.priceRange.min.value !== product.prices?.priceRange.max.value;
  console.log(customFields);
  return (
    <div>
      {product.brand && (
        <p className="mb-2 font-semibold uppercase text-gray-500">{product.brand.name}</p>
      )}

      <h1 className="mb-4 text-4xl font-black lg:text-5xl">{product.name}</h1>

      {/* <ReviewSummary data={product} /> */}

      {product.prices && (
        <div className="my-6 text-2xl font-bold lg:text-3xl">
          {showPriceRange ? (
            <span>
              {format.number(product.prices.priceRange.min.value, {
                style: 'currency',
                currency: product.prices.price.currencyCode,
              })}{' '}
              -{' '}
              {format.number(product.prices.priceRange.max.value, {
                style: 'currency',
                currency: product.prices.price.currencyCode,
              })}
            </span>
          ) : (
            <>
              {product.prices.retailPrice?.value !== undefined && (
                <span>
                  {t('Prices.msrp')}:{' '}
                  <span className="line-through">
                    {format.number(product.prices.retailPrice.value, {
                      style: 'currency',
                      currency: product.prices.price.currencyCode,
                    })}
                  </span>
                  <br />
                </span>
              )}
              {product.prices.salePrice?.value !== undefined &&
              product.prices.basePrice?.value !== undefined ? (
                <>
                  <span>
                    {t('Prices.was')}:{' '}
                    <span className="line-through">
                      {format.number(product.prices.basePrice.value, {
                        style: 'currency',
                        currency: product.prices.price.currencyCode,
                      })}
                    </span>
                  </span>
                  <br />
                  <span>
                    {t('Prices.now')}:{' '}
                    {format.number(product.prices.price.value, {
                      style: 'currency',
                      currency: product.prices.price.currencyCode,
                    })}
                  </span>
                </>
              ) : (
                product.prices.price.value && (
                  <span>
                    {format.number(product.prices.price.value, {
                      style: 'currency',
                      currency: product.prices.price.currencyCode,
                    })}
                  </span>
                )
              )}
            </>
          )}
        </div>
      )}

      <ProductForm data={product} />
      <div className="my-12">
        <h2 className="mb-4 text-xl font-bold md:text-2xl">{t('additionalDetails')}</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {fieldsToRender.includes('SKU') && Boolean(product.sku) && (
            <div>
              <h3 className="font-semibold">{t('sku')}</h3>
              <p>{product.sku}</p>
            </div>
          )}
          {fieldsToRender.includes('UPC' as Field) && Boolean(product.upc) && (
            <div>
              <h3 className="font-semibold">{t('upc')}</h3>
              <p>{product.upc}</p>
            </div>
          )}
          {fieldsToRender.includes('minPurchaseQuantity' as Field) &&
            Boolean(product.minPurchaseQuantity) && (
              <div>
                <h3 className="font-semibold">{t('minPurchase')}</h3>
                <p>{product.minPurchaseQuantity}</p>
              </div>
            )}
          {fieldsToRender.includes('maxPurchaseQuantity' as Field) &&
            Boolean(product.maxPurchaseQuantity) && (
              <div>
                <h3 className="font-semibold">{t('maxPurchase')}</h3>
                <p>{product.maxPurchaseQuantity}</p>
              </div>
            )}
          {fieldsToRender.includes('availabilityV2' as Field) &&
            Boolean(product.availabilityV2.description) && (
              <div>
                <h3 className="font-semibold">{t('availability')}</h3>
                <p>{product.availabilityV2.description}</p>
              </div>
            )}
          {fieldsToRender.includes('Condition' as Field) && Boolean(product.condition) && (
            <div>
              <h3 className="font-semibold">{t('condition')}</h3>
              <p>{product.condition}</p>
            </div>
          )}
          {fieldsToRender.includes('Weight' as Field) && Boolean(product.weight) && (
            <div>
              <h3 className="font-semibold">{t('weight')}</h3>
              <p>
                {product.weight?.value} {product.weight?.unit}
              </p>
            </div>
          )}
          {/* {Boolean(customFields) &&
            customFields
              .filter((customField) => fieldsToRender.includes(customField.name as Field))
              .map((customField) => {
                let customFieldName = customField.name;
                if (customFieldName === 'ProdType') {
                  customFieldName = 'Product Type'; 
                }
                return (
                  <div key={customField.entityId}>
                    <h3 className="font-semibold">{customFieldName}</h3>
                    <p>{customField.value}</p>
                  </div>
                );
              })} */}

          {Boolean(customFields) && (
            <>
              {customFields.some((cf) => cf.name === 'Instrument') && (
                <div key="instrument">
                  <h3 className="font-semibold">Instrument</h3>
                  <p>
                    {customFields
                      .filter((cf) => cf.name === 'Instrument') 
                      .map((cf) => cf.value)
                      .join(', ')}
                  </p>
                </div>
              )}

              {customFields
                .filter((customField) => fieldsToRender.includes(customField.name as Field)) 
                .map((customField) => {
                  let customFieldName = customField.name;
                  if (customFieldName === 'ProdType') {
                    customFieldName = 'Product Type';
                  }
                  if(customFieldName === 'SubBrand'){
                    customFieldName = 'Sub Brand';
                  }

                  if (customFieldName !== 'Instrument') {
                    return (
                      <div key={customField.entityId}>
                        <h3 className="font-semibold">{customFieldName}</h3>
                        <p>{customField.value}</p>
                      </div>
                    );
                  }
                  return null;
                })}
            </>
          )}
        </div>
      </div>
      <ProductSchema product={product} />
    </div>
  );
};
