import { useQuery, useApolloClient, useMutation } from '@apollo/client';
import { useCartContext } from '@magento/peregrine/lib/context/cart';
import mergeOperations from '@magento/peregrine/lib/util/shallowMerge';
import DEFAULT_OPERATIONS from './cardKnox.gql';
import { useCallback, useEffect, useState } from 'react';
import { useFormState, useFormApi } from 'informed';

/**
 * Maps address response data from GET_BILLING_ADDRESS and GET_SHIPPING_ADDRESS
 * queries to input names in the billing address form.
 * {@link creditCard.gql.js}.
 *
 * @param {ShippingCartAddress|BillingCartAddress} rawAddressData query data
 */
export const mapAddressData = rawAddressData => {
    if (rawAddressData) {
        const {
            firstName,
            lastName,
            city,
            postcode,
            phoneNumber,
            street,
            country,
            region
        } = rawAddressData;

        return {
            firstName,
            lastName,
            city,
            postcode,
            phoneNumber,
            street1: street[0],
            street2: street[1] || '',
            country: country.code,
            region: region.code
        };
    } else {
        return {};
    }
};

/**
 * @ignore
 *
 * Flattens query data into a simple object. We create this here rather than
 * having each line summary line component destructure its own data because
 * only the parent "price summary" component knows the data structure.
 *
 * @param {Object} data query data
 */
const flattenData = data => {
    if (!data) return {};
    return {
        subtotal: data.cart.prices.subtotal_excluding_tax,
        total: data.cart.prices.grand_total,
        discounts: data.cart.prices.discounts,
        giftCards: data.cart.applied_gift_cards,
        giftOptions: data.cart.prices.gift_options,
        taxes: data.cart.prices.applied_taxes,
        shipping: data.cart.shipping_addresses
    };
};

export const useCardKnox = props => {
    const {
        onSuccess,
        onReady,
        onError,
        shouldSubmit,
        resetShouldSubmit
    } = props;
    const formState = useFormState();
    const [shouldRequestPaymentNonce, setShouldRequestPaymentNonce] = useState(
        false
    );

    /**
     * `stepNumber` depicts the state of the process flow in credit card
     * payment flow.
     *
     * `0` No call made yet
     * `1` Billing address mutation initiated
     * `3` Payment information mutation initiated
     * `4` All mutations done
     */
    const [stepNumber, setStepNumber] = useState(0);

    const operations = mergeOperations(DEFAULT_OPERATIONS, props.operations);

    const { getBillingAddressQuery, getPriceSummaryQuery } = operations;
    const client = useApolloClient();
    const [{ cartId }] = useCartContext();
    const isLoading = stepNumber >= 1 && stepNumber <= 3;
    const { error, loading, data } = useQuery(getBillingAddressQuery, {
        fetchPolicy: 'cache-and-network',
        nextFetchPolicy: 'cache-first',
        skip: !cartId,
        variables: {
            cartId
        }
    });

    const {
        error: priceError,
        loading: priceLoading,
        data: priceData
    } = useQuery(getPriceSummaryQuery, {
        fetchPolicy: 'cache-and-network',
        nextFetchPolicy: 'cache-first',
        skip: !cartId,
        variables: {
            cartId
        }
    });

    var billingAddress = data ? mapAddressData(data.cart.billingAddress) : {};

    billingAddress.region =
        billingAddress.region == null ? '' : billingAddress.region;

    /**
     * Function to be called by the braintree dropin when the
     * credit card component has loaded successfully.
     */
    const onPaymentReady = useCallback(() => {
        setStepNumber(0);
        if (onReady) {
            onReady();
        }
    }, [onReady]);

    /**
     * Function to be called by the braintree dropin when the
     * nonce generation is successful.
     */
    const onPaymentSuccess = useCallback(token => {
        console.log(token)
        setStepNumber(3);
    }, []);

    /**
     * Function to be called by the braintree dropin when the
     * nonce generation is not successful.
     */
    const onPaymentError = useCallback(
        error => {
            setStepNumber(0);
            setShouldRequestPaymentNonce(false);
            resetShouldSubmit();
            if (onError) {
                onError(error);
            }
        },
        [onError, resetShouldSubmit]
    );

    /**
     * Effects
     */

    /**
     * Step 1 effect
     *
     * User has clicked the update button
     */
    useEffect(() => {
        try {
            if (shouldSubmit) {
                if (onSuccess) {
                    onSuccess();
                }
                resetShouldSubmit();
                setStepNumber(4);
            }
        } catch (err) {
            if (process.env.NODE_ENV !== 'production') {
                console.error(err);
            }
            setStepNumber(0);
            resetShouldSubmit();
            setShouldRequestPaymentNonce(false);
        }
    }, [shouldSubmit, resetShouldSubmit, formState.errors, onSuccess]);


    

    return {
        hasError: !!error,
        hasPriceError: !!priceError,
        hasItems: priceData && !!priceData.cart.items.length,
        isPriceLoading: !!priceLoading,
        isLoading: !!loading,
        flatData: flattenData(priceData),
        billingData: billingAddress,
        onPaymentError,
        onPaymentSuccess,
        onPaymentReady,
        shouldRequestPaymentNonce,
        stepNumber
    };
};
