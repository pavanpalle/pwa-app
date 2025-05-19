import { gql } from '@apollo/client';

export const CategoryFragment = gql`
    # eslint-disable-next-line @graphql-eslint/require-id-when-available
    fragment CategoryFragment on CategoryTree {
        uid
        meta_title
        meta_keywords
        meta_description
    }
`;

export const ProductsFragment = gql`
    fragment ProductsFragment on Products {
         items {
      id
      uid
      __typename

      id
      uid
      media_gallery_entries {
        id
        uid
        label
        position
        disabled
        file
        __typename
      }
      meta_description
      name
      price {
        regularPrice {
          amount {
            currency
            value
            __typename
          }
          __typename
        }
        __typename
      }
      price_range {
        maximum_price {
          final_price {
            currency
            value
            __typename
          }
          discount {
            amount_off
            __typename
          }
          __typename
        }
        __typename
      }
      sku
      small_image {
        url
        __typename
      }
      stock_status
      url_key

      ... on ConfigurableProduct {
        configurable_options {
          id
          attribute_code
          attribute_id
          uid
          label
          values {
            uid
            default_label
            label
            store_label
            use_default_value
            value_index
            swatch_data {
              ... on ImageSwatchData {
                thumbnail
                __typename
              }
              value
              __typename
            }
            __typename
          }
          __typename
        }
        variants {
          attributes {
            code
            value_index
            __typename
          }
          product {
            id
            uid
            media_gallery_entries {
              id
              uid
              disabled
              file
              label
              position
              __typename
            }
            sku
            stock_status
            price {
              regularPrice {
                amount {
                  currency
                  value
                  __typename
                }
                __typename
              }
              __typename
            }
            price_range {
              maximum_price {
                final_price {
                  currency
                  value
                  __typename
                }
                discount {
                  amount_off
                  __typename
                }
                __typename
              }
              __typename
            }

            __typename
          }
          __typename
        }
        __typename
      }
      __typename
    }
        page_info {
            total_pages
            current_page
        }
        total_count
    }
`;
