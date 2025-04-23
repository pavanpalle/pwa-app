import { gql } from '@apollo/client';

export const SavedPaymentsFragment = gql`
    fragment SavedPaymentsFragment on CustomerPaymentTokens {
        items {
            details
            public_hash
            payment_method_code
        }
    }
`;

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

export const ADD_CREDIT_CARD_PAYMENT = gql`
    mutation AddCreditCardPayment($Token: String!, $Exp: String!,$SetAsDefault: Boolean!) {
        createCardknoxPaymentMethod(
            input: {
                Token: $Token
                TokenType: "cc"
                Exp: $Exp
                SetAsDefault: $SetAsDefault
            }
        ) {
            error
            message
        }
    }
`;

export default {
    getSavedPaymentsQuery: GET_SAVED_PAYMENTS_QUERY,
    addNewPaymentMethodMutation: ADD_CREDIT_CARD_PAYMENT,
};
