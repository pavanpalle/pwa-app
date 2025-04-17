
import { gql } from '@apollo/client';
import { PriceSummaryFragment } from '../../CartPage/PriceSummary/priceSummaryFragments.gql';

const GET_PRICE_SUMMARY = gql`
    query getPriceSummary($cartId: String!) {
        cart(cart_id: $cartId) {
            id
            ...PriceSummaryFragment
        }
    }
    ${PriceSummaryFragment}
`;

export const GET_BILLING_ADDRESS = gql`
    query getBillingAddress($cartId: String!) {
        cart(cart_id: $cartId) {
            id
            billingAddress: billing_address {
                firstName: firstname
                lastName: lastname
                country {
                    code
                }
                street
                city
                region {
                    code
                    label
                    region_id
                }
                postcode
                phoneNumber: telephone
            }
        }
    }
`;


export default {
    getBillingAddressQuery: GET_BILLING_ADDRESS,
    getPriceSummaryQuery: GET_PRICE_SUMMARY
   
};
