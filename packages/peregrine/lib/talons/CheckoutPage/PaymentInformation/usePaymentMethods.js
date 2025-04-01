import { useCallback, useMemo } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import useFieldState from '@magento/peregrine/lib/hooks/hook-wrappers/useInformedFieldStateWrapper';
import DEFAULT_OPERATIONS from './paymentMethods.gql';
import mergeOperations from '@magento/peregrine/lib/util/shallowMerge';

import { useCartContext } from '../../../context/cart';
import { BrowserPersistence } from '../../../util';


const storage = new BrowserPersistence();

export const usePaymentMethods = props => {
    const operations = mergeOperations(DEFAULT_OPERATIONS, props.operations);
    const {
        getPaymentMethodsQuery,
        setPaymentMethodOnCartMutation
    } = operations;

    const PaymentOptions = useMemo(() => [
        { code: 0, label: "Net30" },
        { code: 2, label: "Net60" },
        { code: 3, label: "Net90" },
        { code: 4, label: "Net45" },
    ], []);

    const [setPaymentMethod] = useMutation(setPaymentMethodOnCartMutation);

    const [{ cartId }] = useCartContext();

    const { data, loading } = useQuery(getPaymentMethodsQuery, {
        skip: !cartId,
        variables: { cartId }
    });

    const { value: currentSelectedPaymentMethod } = useFieldState(
        'selectedPaymentMethod'
    );
    const userProfile = storage.getItem('customer') || {};
    const availablePaymentMethodsLocal = useMemo(() => {
        return (data && data.cart.available_payment_methods) || [];
    }, [data]);

        console.log('availablePaymentMethodsLocal', availablePaymentMethodsLocal);

        const userPaymentOption = PaymentOptions.find(
            (option) =>
              option.code === userProfile.customattributes[0].paymentterms
          );



          const availablePaymentMethods = userPaymentOption?availablePaymentMethodsLocal?.filter(
            (filterOptions) =>
              filterOptions.code.toLowerCase() ===
              userPaymentOption.label.toLowerCase()
          ):availablePaymentMethodsLocal;



    // If there is one payment method, select it by default.
    // If more than one, none should be selected by default.
    const defaultPaymentCode =
        //(availablePaymentMethods.length && availablePaymentMethods[0].code) ||
        null;
    const selectedPaymentCode =
        (data && data.cart.selected_payment_method.code) || null;

    const initialSelectedMethod =
    availablePaymentMethods.length > 1
            ? selectedPaymentCode
            : defaultPaymentCode;

            console.log('initialSelectedMethod', initialSelectedMethod);
    const handlePaymentMethodSelection = useCallback(
        element => {
            const value = element.target.value;

            const paymentMethodData =
                value == 'braintree'
                    ? {
                          code: value,
                          braintree: {
                              payment_method_nonce: value,
                              is_active_payment_token_enabler: false
                          }
                      }
                    : {
                          code: value
                      };

            setPaymentMethod({
                variables: {
                    cartId,
                    paymentMethod: paymentMethodData
                }
            });
        },
        [cartId, setPaymentMethod]
    );

    return {
        availablePaymentMethods,
        currentSelectedPaymentMethod,
        handlePaymentMethodSelection,
        initialSelectedMethod,
        isLoading: loading
    };
};
