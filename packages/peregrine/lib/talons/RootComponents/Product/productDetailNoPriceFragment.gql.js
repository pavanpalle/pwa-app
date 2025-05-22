import { gql } from '@apollo/client';

export const ProductDetailsNoPriceFragment = gql`
    fragment ProductDetailsNoPriceFragment on ProductInterface {
        __typename
        # eslint-disable-next-line @graphql-eslint/require-id-when-available
        categories {
            uid
            breadcrumbs {
                category_uid
            }
        }
        description {
            html
        }
        short_description {
            html
        }
        id
        uid
        # eslint-disable-next-line @graphql-eslint/require-id-when-available
        media_gallery_entries {
            uid
            label
            position
            disabled
            file
            video_content {
                            video_provider
                            video_url
                            video_title
                            video_description
                            video_metadata
                            media_type
                        }
        }
        meta_description
        name
        sku
        small_image {
            url
        }
        stock_status
        url_key
        custom_attributesV2(filters: { used_in_product_listing: true }) {
            items {
                code
                ... on AttributeValue {
                    value
                }
                ... on AttributeSelectedOptions {
                    selected_options {
                        label
                        value
                    }
                }
            }
            errors {
                type
                message
            }
        }
        ... on ConfigurableProduct {
            # eslint-disable-next-line @graphql-eslint/require-id-when-available
            configurable_options {
                attribute_code
                attribute_id
                uid
                label
                # eslint-disable-next-line @graphql-eslint/require-id-when-available
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
                        }
                        value
                    }
                }
            }
            variants {
                attributes {
                    code
                    value_index
                }
                # eslint-disable-next-line @graphql-eslint/require-id-when-available
                product {
                    uid
                    # eslint-disable-next-line @graphql-eslint/require-id-when-available
                    media_gallery_entries {
                        uid
                        disabled
                        file
                        label
                        position
                        video_content {
                            video_provider
                            video_url
                            video_title
                            video_description
                            video_metadata
                            media_type
                        }
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
                            }
                            ... on AttributeSelectedOptions {
                                selected_options {
                                    label
                                    value
                                }
                            }
                        }
                        errors {
                            type
                            message
                        }
                    }
                }
            }
        }
    }
`;
