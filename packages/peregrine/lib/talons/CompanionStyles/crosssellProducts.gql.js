import { gql } from '@apollo/client';

export const GET_STORE_CONFIG_DATA = gql`
    query getStoreConfigData {
        # eslint-disable-next-line @graphql-eslint/require-id-when-available
        storeConfig {
            store_code
            product_url_suffix
            magento_wishlist_general_is_enabled
        }
    }
`;

export const GET_COMPANION_PRODUCTS_QUERY = gql`
    query getComparableProductsForProductPage($urlKey: String!) {
        products(filter: { url_key: { eq: $urlKey } }) {
            items {
                id
                uid
                url_key
                crosssell_products {
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
                    custom_attributesV2(
                        filters: { used_in_product_listing: true }
                    ) {
                        items {
                            code
                            ... on AttributeValue {
                                value
                                __typename
                            }
                            ... on AttributeSelectedOptions {
                                selected_options {
                                    label
                                    value
                                    __typename
                                }
                                __typename
                            }
                            __typename
                        }
                        errors {
                            type
                            message
                            __typename
                        }
                        __typename
                    }
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
                                qty
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
                                custom_attributesV2(
                                    filters: { used_in_product_listing: true }
                                ) {
                                    items {
                                        code
                                        ... on AttributeValue {
                                            value
                                            __typename
                                        }
                                        ... on AttributeSelectedOptions {
                                            selected_options {
                                                label
                                                value
                                                __typename
                                            }
                                            __typename
                                        }
                                        __typename
                                    }
                                    errors {
                                        type
                                        message
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
            }
        }
    }
`;

export const GET_COMPANION_PRODUCTS_WITHOUTPRICE_QUERY = gql`
    query getComparableProductsForProductPage($urlKey: String!) {
        products(filter: { url_key: { eq: $urlKey } }) {
            items {
                id
                uid
                url_key
                crosssell_products {
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

                    sku
                    small_image {
                        url
                        __typename
                    }
                    stock_status
                    url_key
                    custom_attributesV2(
                        filters: { used_in_product_listing: true }
                    ) {
                        items {
                            code
                            ... on AttributeValue {
                                value
                                __typename
                            }
                            ... on AttributeSelectedOptions {
                                selected_options {
                                    label
                                    value
                                    __typename
                                }
                                __typename
                            }
                            __typename
                        }
                        errors {
                            type
                            message
                            __typename
                        }
                        __typename
                    }
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
                                qty
                                stock_status

                                custom_attributesV2(
                                    filters: { used_in_product_listing: true }
                                ) {
                                    items {
                                        code
                                        ... on AttributeValue {
                                            value
                                            __typename
                                        }
                                        ... on AttributeSelectedOptions {
                                            selected_options {
                                                label
                                                value
                                                __typename
                                            }
                                            __typename
                                        }
                                        __typename
                                    }
                                    errors {
                                        type
                                        message
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
            }
        }
    }
`;

export default {
    getStoreConfigData: GET_STORE_CONFIG_DATA,
    getCompanionProductsQuery: GET_COMPANION_PRODUCTS_QUERY,
    getCompanionProductsWithoutPriceQuery: GET_COMPANION_PRODUCTS_WITHOUTPRICE_QUERY
};
