import { gql } from '@apollo/client';

import { SavedPaymentsFragment } from './savedPaymentsPage.gql';

export const DELETE_CREDIT_CARD_PAYMENT = gql`
    mutation DeleteCreditCardPayment($paymentHash: String!) {
        deletePaymentToken(public_hash: $paymentHash) {
            customerPaymentTokens {
                ...SavedPaymentsFragment
            }
            result
        }
    }
    ${SavedPaymentsFragment}
`;

export const DEFAULT_CREDIT_CARD_PAYMENT = gql`
    mutation SetAsDefaultCreditCardPayment($paymentHash: String!) {
        updateCardknoxPaymentMethod(
            input: {
                PaymentMethodId: $paymentHash
                SetAsDefault: true
                Revision: 1
            }
        ) {
            error
            message
        }
    }
`;

export default {
    deleteCreditCardPaymentMutation: DELETE_CREDIT_CARD_PAYMENT,
    setAsDefaultCreditCardPaymentMutation: DEFAULT_CREDIT_CARD_PAYMENT
};
