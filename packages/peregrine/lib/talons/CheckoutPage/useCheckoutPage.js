import { useCallback, useEffect, useMemo, useState, useRef } from 'react';
import {
    useApolloClient,
    useLazyQuery,
    useMutation,
    useQuery
} from '@apollo/client';
import { useEventingContext } from '../../context/eventing';

import { useHistory } from 'react-router-dom';

import { useUserContext } from '../../context/user';
import { useCartContext } from '../../context/cart';

import mergeOperations from '../../util/shallowMerge';

import DEFAULT_OPERATIONS from './checkoutPage.gql.js';

import CheckoutError from './CheckoutError';
import { useGoogleReCaptcha } from '../../hooks/useGoogleReCaptcha';

export const CHECKOUT_STEP = {
    SHIPPING_ADDRESS: 1,
    SHIPPING_METHOD: 2,
    PAYMENT: 3,
    REVIEW: 4
};

/**
 *
 * @param {DocumentNode} props.operations.getCheckoutDetailsQuery query to fetch checkout details
 * @param {DocumentNode} props.operations.getCustomerQuery query to fetch customer details
 * @param {DocumentNode} props.operations.getOrderDetailsQuery query to fetch order details
 * @param {DocumentNode} props.operations.createCartMutation mutation to create a new cart
 * @param {DocumentNode} props.operations.placeOrderMutation mutation to place order
 *
 * @returns {
 *  activeContent: String,
 *  availablePaymentMethods: Array,
 *  cartItems: Array,
 *  checkoutStep: Number,
 *  customer: Object,
 *  error: ApolloError,
 *  handlePlaceOrder: Function,
 *  handlePlaceOrderEnterKeyPress: Function,
 *  hasError: Boolean,
 *  isCartEmpty: Boolean,
 *  isGuestCheckout: Boolean,
 *  isLoading: Boolean,
 *  isUpdating: Boolean,
 *  orderDetailsData: Object,
 *  orderDetailsLoading: Boolean,
 *  orderNumber: String,
 *  placeOrderLoading: Boolean,
 *  setCheckoutStep: Function,
 *  setIsUpdating: Function,
 *  setShippingInformationDone: Function,
 *  setShippingMethodDone: Function,
 *  setPaymentInformationDone: Function,
 *  scrollShippingInformationIntoView: Function,
 *  shippingInformationRef: ReactRef,
 *  shippingMethodRef: ReactRef,
 *  scrollShippingMethodIntoView: Function,
 *  resetReviewOrderButtonClicked: Function,
 *  handleReviewOrder: Function,
 *  handleReviewOrderEnterKeyPress: Function,
 *  reviewOrderButtonClicked: Boolean,
 *  toggleAddressBookContent: Function,
 *  toggleSignInContent: Function,
 * }
 */
export const useCheckoutPage = (props = {}) => {
    const history = useHistory();
    const operations = mergeOperations(DEFAULT_OPERATIONS, props.operations);
    const {
        createCartMutation,
        getCheckoutDetailsQuery,
        getCustomerQuery,
        getOrderDetailsQuery,
        placeOrderMutation,
        cardKnoxPlaceOrderMutation,
        cardKnoxStaticPlaceOrderMutation,
        validateCartAddressMutation,
        getCustomerAddressesQuery
    } = operations;

    const { generateReCaptchaData, recaptchaWidgetProps } = useGoogleReCaptcha({
        currentForm: 'PLACE_ORDER',
        formAction: 'placeOrder'
    });

    const [reviewOrderButtonClicked, setReviewOrderButtonClicked] = useState(
        false
    );

    const shippingInformationRef = useRef();
    const shippingMethodRef = useRef();

    const apolloClient = useApolloClient();
    const [isUpdating, setIsUpdating] = useState(false);
    const [placeOrderButtonClicked, setPlaceOrderButtonClicked] = useState(
        false
    );
    const [activeContent, setActiveContent] = useState('checkout');
    const [checkoutStep, setCheckoutStep] = useState(
        CHECKOUT_STEP.SHIPPING_ADDRESS
    );
    const [guestSignInUsername, setGuestSignInUsername] = useState('');
    const [showOverlay, setShowOverlay] = useState(false);
    const [suggestedAddress, setSuggestedAddress] = useState();
    const [validateAddress, setValidateAddress] = useState();
    const [paymentHash, setPaymentHash] = useState({
        paymentToken: '',
        cvvToken: '',
        exp: '',
        paymentMethod: '',
        cardType: '',
        saveCard: false
    });

    const [{ isSignedIn }] = useUserContext();
    const [{ cartId }, { createCart, removeCart }] = useCartContext();

    const [fetchCartId] = useMutation(createCartMutation);
    const [
        placeOrder,
        {
            data: placeOrderData,
            error: placeOrderError,
            loading: placeOrderLoading
        }
    ] = useMutation(placeOrderMutation);

    const [
        cardKnoxPlaceOrder,
        { data: cardKnoxPlaceOrderData, error: cardKnoxPlaceOrderError }
    ] = useMutation(cardKnoxPlaceOrderMutation);

    const [
        cardKnoxStaticPlaceOrder,
        {
            data: cardKnoxStaticPlaceOrderData,
            error: cardKnoxStaticPlaceOrderError
        }
    ] = useMutation(cardKnoxStaticPlaceOrderMutation);

    const [
        getOrderDetails,
        { data: orderDetailsData, loading: orderDetailsLoading }
    ] = useLazyQuery(getOrderDetailsQuery, {
        // We use this query to fetch details _just_ before submission, so we
        // want to make sure it is fresh. We also don't want to cache this data
        // because it may contain PII.
        fetchPolicy: 'no-cache'
    });

    const { data: customerData, loading: customerLoading } = useQuery(
        getCustomerQuery,
        { skip: !isSignedIn }
    );
    const {
        data: customerAddressesData,
        loading: customerAddressLoading
    } = useQuery(getCustomerAddressesQuery, { skip: !isSignedIn });

    const {
        data: checkoutData,
        networkStatus: checkoutQueryNetworkStatus
    } = useQuery(getCheckoutDetailsQuery, {
        /**
         * Skip fetching checkout details if the `cartId`
         * is a falsy value.
         */
        skip: !cartId,
        notifyOnNetworkStatusChange: true,
        variables: {
            cartId
        }
    });

    const [validateCartAddress] = useMutation(validateCartAddressMutation);

    const cartItems = useMemo(() => {
        return (checkoutData && checkoutData?.cart?.items) || [];
    }, [checkoutData]);

    /**
     * For more info about network statues check this out
     *
     * https://www.apollographql.com/docs/react/data/queries/#inspecting-loading-states
     */
    const isLoading = useMemo(() => {
        const checkoutQueryInFlight = checkoutQueryNetworkStatus
            ? checkoutQueryNetworkStatus < 7
            : true;

        return (
            checkoutQueryInFlight || customerLoading || customerAddressLoading
        );
    }, [checkoutQueryNetworkStatus, customerLoading, customerAddressLoading]);

    const customer = customerData && customerData.customer;

    const customerAddresses = useMemo(
        () =>
            (customerAddressesData &&
                customerAddressesData.customer.addresses) ||
            [],
        [customerAddressesData]
    );

    const toggleAddressBookContent = useCallback(() => {
        setActiveContent(currentlyActive =>
            currentlyActive === 'checkout' ? 'addressBook' : 'checkout'
        );
    }, []);
    const toggleSignInContent = useCallback(() => {
        setActiveContent(currentlyActive =>
            currentlyActive === 'checkout' ? 'signIn' : 'checkout'
        );
    }, []);

    const checkoutError = useMemo(() => {
        if (
            placeOrderError ||
            cardKnoxPlaceOrderError ||
            cardKnoxStaticPlaceOrderError
        ) {
            return new CheckoutError(
                placeOrderError ||
                    cardKnoxPlaceOrderError ||
                    cardKnoxStaticPlaceOrderError
            );
        }
    }, [
        cardKnoxPlaceOrderError,
        cardKnoxStaticPlaceOrderError,
        placeOrderError
    ]);

    const toggleOverlay = useCallback(() => {
        setShowOverlay(true);
    }, []);

    const isSuggestedAddressAllNull = data => {
        const suggestedAddress = data?.suggested_address;

        // If suggestedAddress is missing or not an object
        if (!suggestedAddress || typeof suggestedAddress !== 'object') {
            return true;
        }

        // Check if every value is null
        return Object.values(suggestedAddress).every(value => value === null);
    };

    const handleReviewOrder = useCallback(async () => {
        // setReviewOrderButtonClicked(true);
        try {
            const shipping = checkoutData?.cart?.shipping_addresses?.[0] || {};
            console.log("shipping",shipping)
            console.log("customerAddresses",customerAddresses)
            const foundSelectedAddress = customerAddresses.find(
                customerAddress =>
                    customerAddress.street[0] === shipping.street[0] &&
                    customerAddress.firstname === shipping.firstname &&
                    customerAddress.lastname === shipping.lastname
            );

            console.log("foundSelectedAddress",foundSelectedAddress)
            if (Object.keys(shipping).length === 0) {
                return;
            }

            // Step 1: Validate address via GraphQL mutation
            const data = await validateCartAddress({
                variables: {
                    input: {
                        AddressLine: foundSelectedAddress.street[0] || '',
                        AddressLine2: foundSelectedAddress.street[1] || '',
                        City: foundSelectedAddress.city,
                        State: foundSelectedAddress?.region?.region_code,
                        Postcode: foundSelectedAddress.postcode,
                        CountryCode: foundSelectedAddress?.country_code
                    }
                }
            });

            const addressValidation = data?.data?.addressValidation;
            // Step 2: If valid or "Unknown", apply address to cart

            if (
                addressValidation?.is_valid ||
                addressValidation?.classification === 'Unknown'
            ) {
                setReviewOrderButtonClicked(true);
            }
            // Step 3: If invalid but has a suggestion, show suggestion
            else if (
                !addressValidation?.is_valid &&
                !isSuggestedAddressAllNull(addressValidation)
            ) {
                setValidateAddress(foundSelectedAddress);
                setSuggestedAddress(addressValidation.suggested_address);
                toggleOverlay();
               // toggleAddressBookContent();
               
            }
        } catch (e) {
            console.log('e', e);
            return;
        }
    }, [
        checkoutData,
        customerAddresses,
        toggleOverlay,
        validateCartAddress
    ]);

    const handleReviewOrderEnterKeyPress = useCallback(() => {
        event => {
            if (event.key === 'Enter') {
                handleReviewOrder();
            }
        };
    }, [handleReviewOrder]);

    const resetReviewOrderButtonClicked = useCallback(() => {
        setReviewOrderButtonClicked(false);
    }, []);

    const scrollShippingInformationIntoView = useCallback(() => {
        if (shippingInformationRef.current) {
            shippingInformationRef.current.scrollIntoView({
                behavior: 'smooth'
            });
        }
    }, [shippingInformationRef]);

    const setShippingInformationDone = useCallback(() => {
        if (checkoutStep === CHECKOUT_STEP.SHIPPING_ADDRESS) {
            setCheckoutStep(CHECKOUT_STEP.SHIPPING_METHOD);
        }
    }, [checkoutStep]);

    const scrollShippingMethodIntoView = useCallback(() => {
        if (shippingMethodRef.current) {
            shippingMethodRef.current.scrollIntoView({
                behavior: 'smooth'
            });
        }
    }, [shippingMethodRef]);

    const setShippingMethodDone = useCallback(() => {
        if (checkoutStep === CHECKOUT_STEP.SHIPPING_METHOD) {
            setCheckoutStep(CHECKOUT_STEP.PAYMENT);
        }
    }, [checkoutStep]);

    const setPaymentInformationDone = useCallback(() => {
        if (checkoutStep === CHECKOUT_STEP.PAYMENT) {
            globalThis.scrollTo({
                left: 0,
                top: 0,
                behavior: 'smooth'
            });
            setCheckoutStep(CHECKOUT_STEP.REVIEW);
        }
    }, [checkoutStep]);

    const [isPlacingOrder, setIsPlacingOrder] = useState(false);

    const handlePlaceOrder = useCallback(async () => {
        // Fetch order details and then use an effect to actually place the
        // order. If/when Apollo returns promises for invokers from useLazyQuery
        // we can just await this function and then perform the rest of order
        // placement.
        await getOrderDetails({
            variables: {
                cartId
            }
        });
        setPlaceOrderButtonClicked(true);
        setIsPlacingOrder(true);
        localStorage.setItem('orderCount', '1');
    }, [cartId, getOrderDetails]);

    const handlePlaceOrderEnterKeyPress = useCallback(() => {
        event => {
            if (event.key === 'Enter') {
                handlePlaceOrder();
            }
        };
    }, [handlePlaceOrder]);

    const [, { dispatch }] = useEventingContext();

    // Go back to checkout if shopper logs in
    useEffect(() => {
        if (isSignedIn) {
            setActiveContent('checkout');
        }
    }, [isSignedIn]);

    useEffect(() => {
        async function placeOrderAndCleanup() {
            try {
                const reCaptchaData = await generateReCaptchaData();

                if (paymentHash.paymentMethod === 'cardknox') {
                    await cardKnoxPlaceOrder({
                        variables: {
                            cartId,
                            Token: paymentHash.paymentToken,
                            Exp: paymentHash.exp,
                            cvv: paymentHash.cvvToken,
                            saveCard: paymentHash.saveCard,
                            cardType: paymentHash.cardType
                        },
                        ...reCaptchaData
                    });
                } else if (paymentHash.paymentMethod === 'cardknox_static') {
                    await cardKnoxStaticPlaceOrder({
                        variables: {
                            cartId,
                            Token: paymentHash.paymentToken
                        },
                        ...reCaptchaData
                    });
                } else {
                    await placeOrder({
                        variables: {
                            cartId
                        },
                        ...reCaptchaData
                    });
                }
                // Cleanup stale cart and customer info.
                await removeCart();
                await apolloClient.clearCacheData(apolloClient, 'cart');

                await createCart({
                    fetchCartId
                });
            } catch (err) {
                console.error(
                    'An error occurred during when placing the order',
                    err
                );
                setPlaceOrderButtonClicked(false);
            }
        }

        if (orderDetailsData && isPlacingOrder) {
            setIsPlacingOrder(false);
            placeOrderAndCleanup();
        }
    }, [
        apolloClient,
        cartId,
        createCart,
        fetchCartId,
        generateReCaptchaData,
        orderDetailsData,
        placeOrder,
        removeCart,
        isPlacingOrder,
        paymentHash,
        cardKnoxPlaceOrder,
        cardKnoxStaticPlaceOrder
    ]);

    useEffect(() => {
        if (
            checkoutStep === CHECKOUT_STEP.SHIPPING_ADDRESS &&
            cartItems.length
        ) {
            dispatch({
                type: 'CHECKOUT_PAGE_VIEW',
                payload: {
                    cart_id: cartId,
                    products: cartItems
                }
            });
        } else if (reviewOrderButtonClicked) {
            dispatch({
                type: 'CHECKOUT_REVIEW_BUTTON_CLICKED',
                payload: {
                    cart_id: cartId
                }
            });
        } else if (
            placeOrderButtonClicked &&
            orderDetailsData &&
            orderDetailsData.cart
        ) {
            const shipping =
                orderDetailsData.cart?.shipping_addresses &&
                orderDetailsData.cart.shipping_addresses.reduce(
                    (result, item) => {
                        return [
                            ...result,
                            {
                                ...item.selected_shipping_method
                            }
                        ];
                    },
                    []
                );
            const eventPayload = {
                cart_id: cartId,
                amount: orderDetailsData.cart.prices,
                shipping: shipping,
                payment: orderDetailsData.cart.selected_payment_method,
                products: orderDetailsData.cart.items
            };
            if (isPlacingOrder) {
                dispatch({
                    type: 'CHECKOUT_PLACE_ORDER_BUTTON_CLICKED',
                    payload: eventPayload
                });
            } else if (placeOrderData && orderDetailsData?.cart.id === cartId) {
                dispatch({
                    type: 'ORDER_CONFIRMATION_PAGE_VIEW',
                    payload: {
                        order_number: placeOrderData.placeOrder.orderV2.number,
                        ...eventPayload
                    }
                });
            } else if (
                cardKnoxPlaceOrderData &&
                orderDetailsData?.cart.id === cartId
            ) {
                dispatch({
                    type: 'ORDER_CONFIRMATION_PAGE_VIEW',
                    payload: {
                        order_number:
                            cardKnoxPlaceOrderData.createCardknoxOrder.OrderId,
                        ...eventPayload
                    }
                });
            } else if (
                cardKnoxStaticPlaceOrderData &&
                orderDetailsData?.cart.id === cartId
            ) {
                dispatch({
                    type: 'ORDER_CONFIRMATION_PAGE_VIEW',
                    payload: {
                        order_number:
                            cardKnoxStaticPlaceOrderData
                                .createCardknoxStaticOrder.OrderId,
                        ...eventPayload
                    }
                });
            }
        }
    }, [
        placeOrderButtonClicked,
        cartId,
        checkoutStep,
        orderDetailsData,
        cartItems,
        isLoading,
        dispatch,
        placeOrderData,
        isPlacingOrder,
        reviewOrderButtonClicked,
        cardKnoxPlaceOrderData,
        cardKnoxStaticPlaceOrderData
    ]);
    useEffect(() => {
        if (
            isSignedIn &&
            (placeOrderData ||
                cardKnoxPlaceOrderData ||
                cardKnoxStaticPlaceOrderData)
        ) {
            history.push('/order-confirmation', {
                orderNumber:
                    (placeOrderData &&
                        placeOrderData.placeOrder.orderV2.number) ||
                    (cardKnoxPlaceOrderData &&
                        cardKnoxPlaceOrderData.createCardknoxOrder.OrderId) ||
                    (cardKnoxStaticPlaceOrderData &&
                        cardKnoxStaticPlaceOrderData.createCardknoxStaticOrder
                            .OrderId),
                items: cartItems
            });
        } else if (!isSignedIn && placeOrderData) {
            history.push('/checkout');
        }
    }, [
        isSignedIn,
        placeOrderData,
        cartItems,
        history,
        cardKnoxPlaceOrderData,
        cardKnoxStaticPlaceOrderData
    ]);

    return {
        activeContent,
        availablePaymentMethods: checkoutData
            ? checkoutData?.cart?.available_payment_methods
            : null,
        cartItems,
        checkoutStep,
        customer,
        error: checkoutError,
        guestSignInUsername,
        handlePlaceOrder,
        handlePlaceOrderEnterKeyPress,
        hasError: !!checkoutError,
        isCartEmpty: !(checkoutData && checkoutData?.cart?.total_quantity),
        isGuestCheckout: !isSignedIn,
        isLoading,
        isUpdating,
        orderDetailsData,
        orderDetailsLoading,
        orderNumber:
            (placeOrderData && placeOrderData.placeOrder.orderV2.number) ||
            (cardKnoxPlaceOrderData &&
                cardKnoxPlaceOrderData.createCardknoxOrder.OrderId) ||
            (cardKnoxStaticPlaceOrderData &&
                cardKnoxStaticPlaceOrderData.createCardknoxStaticOrder
                    .OrderId) ||
            null,
        placeOrderLoading,
        placeOrderButtonClicked,
        setCheckoutStep,
        setGuestSignInUsername,
        setIsUpdating,
        setShippingInformationDone,
        setShippingMethodDone,
        setPaymentInformationDone,
        scrollShippingInformationIntoView,
        shippingInformationRef,
        shippingMethodRef,
        scrollShippingMethodIntoView,
        resetReviewOrderButtonClicked,
        handleReviewOrder,
        handleReviewOrderEnterKeyPress,
        reviewOrderButtonClicked,
        recaptchaWidgetProps,
        toggleAddressBookContent,
        toggleSignInContent,
        setPaymentHash,
        showOverlay,
        setShowOverlay,
        suggestedAddress,
        setSuggestedAddress,
        validateAddress,
        setValidateAddress
    };
};
