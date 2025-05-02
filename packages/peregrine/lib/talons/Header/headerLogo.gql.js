import { gql } from '@apollo/client';

export const GET_HEADER_LOGO_DATA = gql`
    query getStoreConfigData {
        # eslint-disable-next-line @graphql-eslint/require-id-when-available
        storeConfig {
             header_logo_src
             store_name,
             store_code
        }
    }
`;


export default {
    getHeaderLogoData: GET_HEADER_LOGO_DATA,
};