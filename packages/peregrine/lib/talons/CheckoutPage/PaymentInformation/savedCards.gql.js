import { gql } from '@apollo/client';

export const GET_SAVED_PAYMENTS_QUERY = gql`
    query GetSavedPayments {
        cardknoxPaymentMethods {
            PaymentMethodId
            CustomerId
            Token
            TokenType
            MaskedNumber
            CardType
            Exp
            IsDefaultPaymentMethod
            Revision
        }
    }
`;

export default {
    getSavedPaymentsQuery: GET_SAVED_PAYMENTS_QUERY
};
