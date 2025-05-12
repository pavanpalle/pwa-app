import { gql } from '@apollo/client';

export const GET_PAGE_SIZE = gql`
    query getPageSize {
        # eslint-disable-next-line @graphql-eslint/require-id-when-available
        storeConfig {
            store_code
            grid_per_page
        }
    }
`;

export const GET_PRODUCT_FILTERS_BY_SEARCH = gql`
    query getProductFiltersBySearch($search: String!) {
        products(search: $search) {
            aggregations {
                label
                count
                attribute_code
                options {
                    label
                    value
                }
                position
            }
        }
    }
`;

export const GET_SEARCH_TERM_DATA = gql`
    query getSearchTermData($search: String) {
        searchTerm(Search: $search) {
            query_text
            redirect
            popularity
        }
    }
`;

export const PRODUCT_SEARCH = gql`
    query ProductSearch(
        $currentPage: Int = 1
        $inputText: String!
        $pageSize: Int = 6
        $filters: ProductAttributeFilterInput!
        $sort: ProductAttributeSortInput
    ) {
        products(
            currentPage: $currentPage
            pageSize: $pageSize
            search: $inputText
            filter: $filters
            sort: $sort
        ) {
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
                __typename
            }
            total_count
            __typename
        }
    }
`;

export const GET_FILTER_INPUTS = gql`
    query GetFilterInputsForSearch {
        __type(name: "ProductAttributeFilterInput") {
            inputFields {
                name
                type {
                    name
                }
            }
        }
    }
`;

export const GET_SEARCH_AVAILABLE_SORT_METHODS = gql`
    query getSearchAvailableSortMethods($search: String!) {
        products(search: $search) {
            sort_fields {
                options {
                    label
                    value
                }
            }
        }
    }
`;

export default {
    getFilterInputsQuery: GET_FILTER_INPUTS,
    getPageSize: GET_PAGE_SIZE,
    getSearchTermData: GET_SEARCH_TERM_DATA,
    getProductFiltersBySearchQuery: GET_PRODUCT_FILTERS_BY_SEARCH,
    getSearchAvailableSortMethods: GET_SEARCH_AVAILABLE_SORT_METHODS,
    productSearchQuery: PRODUCT_SEARCH
};
