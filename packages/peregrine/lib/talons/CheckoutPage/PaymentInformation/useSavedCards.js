import { useQuery } from '@apollo/client';

import { useUserContext } from '@magento/peregrine/lib/context/user';
import mergeOperations from '@magento/peregrine/lib/util/shallowMerge';

import defaultOperations from './savedCards.gql';
import { useCallback, useEffect } from 'react';

export const useSavedCards = (props = {}) => {
    const { setPaymentHash } = props;

    const operations = mergeOperations(defaultOperations, props.operations);
    const { getSavedPaymentsQuery } = operations;

    const [{ isSignedIn }] = useUserContext();

    const { data: savedCardsData, loading } = useQuery(getSavedPaymentsQuery, {
        fetchPolicy: 'cache-and-network',
        nextFetchPolicy: 'cache-first',
        skip: !isSignedIn
    });

    const savedCards =
        (savedCardsData && savedCardsData.cardknoxPaymentMethods) || [];

    const defaultCard = savedCards.find(
        method => method.IsDefaultPaymentMethod === true
    );

    const handleSubmit = useCallback(
        async value => {
            setPaymentHash({
                paymentToken: value.paymentHash,
                cvvToken: '',
                exp: '',
                paymentMethod: 'cardknox_static'
            });
        },
        [setPaymentHash]
    );

    useEffect(() => {
        if (defaultCard) {
            setPaymentHash({
                paymentToken: defaultCard.Token,
                cvvToken: '',
                exp: '',
                paymentMethod: 'cardknox_static'
            });
        }
    }, [defaultCard, setPaymentHash]);
    return {
        isLoading: loading,
        savedCards,
        handleSubmit,
        defaultCard
    };
};
