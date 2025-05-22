import { gql } from '@apollo/client';
export const GET_STORE_CONFIG_DATA = gql`
    query GetStoreConfigForMegaMenu {
        # eslint-disable-next-line @graphql-eslint/require-id-when-available
        storeConfig {
            store_code
            category_url_suffix
        }
    }
`;

export const GET_ALL_CATEGORIES = gql`
    query getAllCategories {
        # eslint-disable-next-line @graphql-eslint/require-id-when-available
        categories(filters: { category_uid: { eq: "NTg=" } }) {
            items {
                id
                uid
                name
                # eslint-disable-next-line @graphql-eslint/require-id-when-available
                children {
                    uid
                    include_in_menu
                    name
                    position
                    url_path
                    image
                    # eslint-disable-next-line @graphql-eslint/require-id-when-available
                    children {
                        uid
                        include_in_menu
                        name
                        position
                        url_path
                        image
                        # eslint-disable-next-line @graphql-eslint/require-id-when-available
                        children {
                            uid
                            include_in_menu
                            name
                            position
                            url_path
                            image
                        }
                    }
                }
            }
        }
    }
`;

export default {
    getAllCategoriesQuery: GET_ALL_CATEGORIES,
    getStoreConfigQuery: GET_STORE_CONFIG_DATA
};
