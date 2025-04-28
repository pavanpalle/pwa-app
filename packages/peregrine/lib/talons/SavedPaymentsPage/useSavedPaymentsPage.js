import { useCallback, useEffect, useState } from 'react';
import { useMutation, useQuery } from '@apollo/client';

import { useAppContext } from '@magento/peregrine/lib/context/app';
import { useUserContext } from '@magento/peregrine/lib/context/user';
import mergeOperations from '@magento/peregrine/lib/util/shallowMerge';

import defaultOperations from './savedPaymentsPage.gql';
import { useFormApi, useFormState } from 'informed';

export const normalizeTokens = responseData => {
    const paymentTokens =
        (responseData && responseData.cardknoxPaymentMethods) || [];

    return paymentTokens.map(
        ({ details, public_hash, payment_method_code }) => ({
            // details is a stringified object.
            details: JSON.parse(details),
            public_hash,
            payment_method_code
        })
    );
};
/**
 * This talon contains logic for a saved payment page component.
 * It performs effects and returns prop data for rendering the component.
 *
 * @function
 *
 * @param {Object} props
 * @param {SavedPaymentsPageQueries} props.operations GraphQL queries
 *
 * @returns {SavedPaymentsPageTalonProps}
 *
 * @example <caption>Importing into your project</caption>
 * import { useSavedPayments } from '@magento/peregrine/lib/talons/SavedPaymentsPage/useSavedPaymentsPage';
 */
export const useSavedPaymentsPage = (props = {}) => {
    const operations = mergeOperations(defaultOperations, props.operations);
    const { getSavedPaymentsQuery, addNewPaymentMethodMutation } = operations;
    const [addCard, setAddCard] = useState(false);
    const [
        ,
        {
            actions: { setPageLoading }
        }
    ] = useAppContext();
    const [{ isSignedIn }] = useUserContext();

    const { data: savedPaymentsData, loading } = useQuery(
        getSavedPaymentsQuery,
        {
            fetchPolicy: 'cache-and-network',
            nextFetchPolicy: 'cache-first',
            skip: !isSignedIn
        }
    );
    const [
        addPaymentMethod,
        { loading: addPaymentMethodLoading }
    ] = useMutation(addNewPaymentMethodMutation, {
        onCompleted: () => {
            setAddCard(current => !current);
        }
    });
    // Update the page indicator if the GraphQL query is in flight.
    useEffect(() => {
        setPageLoading(loading);
    }, [loading, setPageLoading]);

    const savedPayments =
        (savedPaymentsData && savedPaymentsData.cardknoxPaymentMethods) || [];

    const toggleAddCard = useCallback(() => {
        setAddCard(current => !current);
    }, []);

    const getExpiryDate = (expMonth, expYear) => {
        // Pad month with leading zero if needed
        const month = String(expMonth).padStart(2, '0');
        // Get last two digits of year
        const year = String(expYear).slice(-2);
        return month + year;
    };

    const handleAddPaymentMethod = useCallback(
        data => {
            const expDate = getExpiryDate(data.expMonth, data.expYear);

            addPaymentMethod({
                variables: {
                    Token: data.token,
                    Exp: expDate,
                    CardType:data.issuer,
                    SetAsDefault: data.isChecked
                },
                refetchQueries: [{ query: getSavedPaymentsQuery }]
            });
        },
        [addPaymentMethod, getSavedPaymentsQuery]
    );

    return {
        isLoading: loading,
        savedPayments,
        toggleAddCard,
        addCard,
        handleAddPaymentMethod,
        isProcessing: addPaymentMethodLoading
    };
};

/** JSDoc type definitions */

/**
 * GraphQL formatted string queries used in this talon.
 *
 * @typedef {Object} SavedPaymentsPageQueries
 *
 * @property {GraphQLAST} getSavedPaymentsQuery Query for getting saved payments. See https://devdocs.magento.com/guides/v2.4/graphql/queries/customer-payment-tokens.html
 *
 * @see [savedPaymentsPage.gql.js]{@link https://github.com/magento/pwa-studio/blob/develop/packages/peregrine/lib/talons/SavedPaymentsPage/savedPaymentsPage.gql.js}
 * for queries used in Venia
 */

/**
 * Props data to use when rendering a cart page component.
 *
 * @typedef {Object} SavedPaymentsPageTalonProps
 *
 * @property {function} handleAddPayment Callback function to add a payment.
 * @property {boolean} isLoading true if the query is refreshing from network
 * @property {Array<Object>} savedPayments  An array of saved payment data.
 */
