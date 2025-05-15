import { gql } from '@apollo/client';

import { ProductDetailsFragment } from './productDetailFragment.gql';
import { ProductDetailsNoPriceFragment } from './productDetailNoPriceFragment.gql';

export const GET_STORE_CONFIG_DATA = gql`
    query getStoreConfigData {
        # eslint-disable-next-line @graphql-eslint/require-id-when-available
        storeConfig {
            store_code
            product_url_suffix
        }
    }
`;

export const GET_PRODUCT_DETAIL_QUERY = gql`
    query getProductDetailForProductPage($urlKey: String!) {
        products(filter: { url_key: { eq: $urlKey } }) {
            items {
                id
                uid
                ...ProductDetailsFragment
            }
        }
    }
    ${ProductDetailsFragment}
`;

export const GET_PRODUCT_DETAIL_NO_PRICE_QUERY = gql`
    query getProductDetailForProductPage($urlKey: String!) {
        products(filter: { url_key: { eq: $urlKey } }) {
            items {
                id
                uid
                ...ProductDetailsNoPriceFragment
            }
        }
    }
    ${ProductDetailsNoPriceFragment}
`;

export default {
    getStoreConfigData: GET_STORE_CONFIG_DATA,
    getProductDetailQuery: GET_PRODUCT_DETAIL_QUERY,
    getProductDetailNoPriceQuery: GET_PRODUCT_DETAIL_NO_PRICE_QUERY
};
