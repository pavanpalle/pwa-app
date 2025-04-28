import { gql } from '@apollo/client';
import { PriceSummaryFragment } from '../../CartPage/PriceSummary/priceSummaryFragments.gql';

import { ShippingInformationFragment } from './shippingInformationFragments.gql';
import { ShippingMethodsCheckoutFragment } from '../ShippingMethod/shippingMethodFragments.gql';
import { AvailablePaymentMethodsFragment } from '../PaymentInformation/paymentInformation.gql';

export const GET_SHIPPING_INFORMATION = gql`
    query GetShippingInformation($cartId: String!) {
        cart(cart_id: $cartId) {
            id
            ...ShippingInformationFragment
        }
    }
    ${ShippingInformationFragment}
`;

export const GET_DEFAULT_SHIPPING = gql`
    query GetDefaultShipping {
        # eslint-disable-next-line @graphql-eslint/require-id-when-available
        customer {
            default_shipping
            default_billing
        }
    }
`;

export const SET_CUSTOMER_ADDRESS_ON_CART = gql`
    mutation SetCustomerAddressOnCart($cartId: String!, $addressId: Int!) {
        setShippingAddressesOnCart(
            input: {
                cart_id: $cartId
                shipping_addresses: [{ customer_address_id: $addressId }]
            }
        ) {
            cart {
                id
                ...ShippingInformationFragment
                ...ShippingMethodsCheckoutFragment
                ...PriceSummaryFragment
                ...AvailablePaymentMethodsFragment
            }
        }
    }
    ${ShippingInformationFragment}
    ${ShippingMethodsCheckoutFragment}
    ${PriceSummaryFragment}
    ${AvailablePaymentMethodsFragment}
`;
export const VALIDATE_CUSTOMER_CART_ADDRESS = gql`
    mutation ValidateCustomerCartAddress($input: AddressValidationInput!) {
        addressValidation(input: $input) {
            error
            error_message
            is_valid
            classification
            original_address {
                AddressLine
                AddressLine2
                City
                State
                Postcode
                CountryCode
            }
            suggested_address {
                AddressLine
                City
                Postcode
                CountryCode
                Region {
                    region
                    region_code
                    region_id
                }
            }
        }
    }
`;
export default {
    setDefaultAddressOnCartMutation: SET_CUSTOMER_ADDRESS_ON_CART,
    getDefaultShippingQuery: GET_DEFAULT_SHIPPING,
    getShippingInformationQuery: GET_SHIPPING_INFORMATION,
    validateAddressMutation: VALIDATE_CUSTOMER_CART_ADDRESS
};
