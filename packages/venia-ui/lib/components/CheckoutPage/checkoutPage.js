import React, { Fragment, useEffect } from 'react';
import { shape, string } from 'prop-types';
import { FormattedMessage, useIntl } from 'react-intl';
import { AlertCircle as AlertCircleIcon } from 'react-feather';
import { Link, useHistory } from 'react-router-dom';

import { useWindowSize, useToasts } from '@magento/peregrine';
import {
    CHECKOUT_STEP,
    useCheckoutPage
} from '@magento/peregrine/lib/talons/CheckoutPage/useCheckoutPage';
import { useStyle } from '../../classify';
import Button from '../Button';
import { StoreTitle } from '../Head';
import Icon from '../Icon';
import { fullPageLoadingIndicator } from '../LoadingIndicator';
import StockStatusMessage from '../StockStatusMessage';
import FormError from '../FormError';
import AddressBook from './AddressBook';
import GuestSignIn from './GuestSignIn';
import OrderSummary from './OrderSummary';
import PaymentInformation from './PaymentInformation';
import payments from './PaymentInformation/paymentMethodCollection';
import PriceAdjustments from './PriceAdjustments';
import ShippingMethod from './ShippingMethod';
import ShippingInformation from './ShippingInformation';
import ItemsReview from './ItemsReview';
import OrderConfirmationPage from './OrderConfirmationPage';
import GoogleReCaptcha from '../GoogleReCaptcha';

import defaultClasses from './checkoutPage.module.css';
import ScrollAnchor from '../ScrollAnchor/scrollAnchor';
import Checkbox from '../Checkbox';
import BillingAddress from './BillingAddress/billingAddress';
import { Form } from 'informed';
import CreditCard from './PaymentInformation/creditCard';

const errorIcon = <Icon src={AlertCircleIcon} size={20} />;

const CheckoutPage = props => {
    const history = useHistory();
    const { classes: propClasses } = props;
    const { formatMessage } = useIntl();
    const talonProps = useCheckoutPage();

    const {
        /**
         * Enum, one of:
         * SHIPPING_ADDRESS, SHIPPING_METHOD, PAYMENT, REVIEW
         */
        activeContent,
        availablePaymentMethods,
        cartItems,
        checkoutStep,
        customer,
        error,
        guestSignInUsername,
        handlePlaceOrder,
        handlePlaceOrderEnterKeyPress,
        hasError,
        isCartEmpty,
        isGuestCheckout,
        isLoading,
        isUpdating,
        orderDetailsLoading,
        orderDetailsData,
        orderNumber,
        placeOrderLoading,
        placeOrderButtonClicked,
        setCheckoutStep,
        setGuestSignInUsername,
        setIsUpdating,
        setShippingInformationDone,
        scrollShippingInformationIntoView,
        setShippingMethodDone,
        scrollShippingMethodIntoView,
        setPaymentInformationDone,
        shippingInformationRef,
        shippingMethodRef,
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
    } = talonProps;

    const [, { addToast }] = useToasts();
    const orderCount = localStorage.getItem('orderCount');
    useEffect(() => {
        if (isGuestCheckout && !orderDetailsData) {
            if (orderCount === '1') {
                history.push('/');
                localStorage.setItem('orderCount', '0');
            }
        }
    }, [isGuestCheckout, history, orderDetailsData, orderCount]);
    useEffect(() => {
        if (hasError) {
            const message =
                error && error.message
                    ? error.message
                    : formatMessage({
                          id: 'checkoutPage.errorSubmit',
                          defaultMessage:
                              'Oops! An error occurred while submitting. Please try again.'
                      });
            addToast({
                type: 'error',
                icon: errorIcon,
                message,
                dismissable: true,
                timeout: 7000
            });

            if (process.env.NODE_ENV !== 'production') {
                console.error(error);
            }
        }
    }, [addToast, error, formatMessage, hasError]);

    const classes = useStyle(defaultClasses, propClasses);

    const windowSize = useWindowSize();
    const isMobile = windowSize.innerWidth <= 960;

    let checkoutContent;

    const heading = isGuestCheckout
        ? formatMessage({
              id: 'checkoutPage.guestCheckout',
              defaultMessage: 'Guest Checkout'
          })
        : formatMessage({
              id: 'checkoutPage.checkout',
              defaultMessage: 'Checkout'
          });

    if (isGuestCheckout && orderDetailsData && orderNumber) {
        return (
            <OrderConfirmationPage
                data={orderDetailsData}
                orderNumber={orderNumber}
            />
        );
    } else if (isLoading) {
        return fullPageLoadingIndicator;
    } else if (isCartEmpty) {
        checkoutContent = (
            <div className={classes.empty_cart_container}>
                <div className={classes.heading_container}>
                    <h1
                        aria-live="polite"
                        className={classes.heading}
                        data-cy="ChekoutPage-heading"
                    >
                        {heading}
                    </h1>
                </div>
                <h3>
                    <FormattedMessage
                        id={'checkoutPage.emptyMessage'}
                        defaultMessage={'There are no items in your cart.'}
                    />
                </h3>
            </div>
        );
    } else {
        const signInContainerVisible =
            isGuestCheckout && checkoutStep !== CHECKOUT_STEP.REVIEW;
        const signInContainerElement = signInContainerVisible ? (
            <div className={classes.signInContainer}>
                <span className={classes.signInLabel}>
                    <FormattedMessage
                        id={'checkoutPage.signInLabel'}
                        defaultMessage={'Sign in for Express Checkout'}
                    />
                </span>
                <Button
                    className={classes.signInButton}
                    data-cy="CheckoutPage-signInButton"
                    onClick={toggleSignInContent}
                    onTouchStart={toggleSignInContent}
                    priority="normal"
                >
                    <FormattedMessage
                        id={'checkoutPage.signInButton'}
                        defaultMessage={'Sign In'}
                    />
                </Button>
            </div>
        ) : null;

        const shippingMethodSection =
            checkoutStep >= CHECKOUT_STEP.SHIPPING_METHOD ? (
                <ShippingMethod
                    pageIsUpdating={isUpdating}
                    onSave={setShippingMethodDone}
                    onSuccess={scrollShippingMethodIntoView}
                    setPageIsUpdating={setIsUpdating}
                />
            ) : (
                <h3 className={classes.shipping_method_heading}>
                    <FormattedMessage
                        id={'checkoutPage.shippingMethodStep'}
                        defaultMessage={'2. Shipping Method'}
                    />
                </h3>
            );

        const formErrors = [];
        const paymentMethods = Object.keys(payments);

        // If we have an implementation, or if this is a "zero" checkout,
        // we can allow checkout to proceed.
        // const isPaymentAvailable = !!availablePaymentMethods.find(
        //     ({ code }) => code === 'cashondelivery' || paymentMethods.includes(code)
        // );

        // const isPaymentAvailable = true;

        // if (!isPaymentAvailable) {
        //     formErrors.push(
        //         new Error(
        //             formatMessage({
        //                 id: 'checkoutPage.noPaymentAvailable',
        //                 defaultMessage: 'Payment is currently unavailable.'
        //             })
        //         )
        //     );
        // }

        const paymentInformationSection =
            checkoutStep >= CHECKOUT_STEP.PAYMENT ? (
                <PaymentInformation
                    onSave={setPaymentInformationDone}
                    checkoutError={error}
                    resetShouldSubmit={resetReviewOrderButtonClicked}
                    setCheckoutStep={setCheckoutStep}
                    shouldSubmit={reviewOrderButtonClicked}
                    setPaymentHash={setPaymentHash}
                />
            ) : (
                <h3 className={classes.payment_information_heading}>
                    <FormattedMessage
                        id={'checkoutPage.paymentInformationStep'}
                        defaultMessage={'3. Payment Information'}
                    />
                </h3>
            );

        const priceAdjustmentsSection =
            checkoutStep === CHECKOUT_STEP.PAYMENT ? (
                <div className={classes.price_adjustments_container}>
                    <PriceAdjustments setPageIsUpdating={setIsUpdating} />
                </div>
            ) : null;

        const reviewOrderButton =
            checkoutStep === CHECKOUT_STEP.PAYMENT ? (
                <Button
                    onClick={handleReviewOrder}
                    onTouchStart={handleReviewOrder}
                    onKeyDown={handleReviewOrderEnterKeyPress}
                    priority="high"
                    className={classes.review_order_button}
                    data-cy="CheckoutPage-reviewOrderButton"
                    disabled={reviewOrderButtonClicked || isUpdating}
                >
                    <FormattedMessage
                        id={'checkoutPage.reviewOrder'}
                        defaultMessage={'Review Order'}
                    />
                </Button>
            ) : null;

        const itemsReview =
            checkoutStep === CHECKOUT_STEP.REVIEW ? (
                <div className={classes.items_review_container}>
                    <ItemsReview items={cartItems} />
                </div>
            ) : null;

        const placeOrderButton =
            checkoutStep === CHECKOUT_STEP.REVIEW ? (
                <Button
                    onClick={handlePlaceOrder}
                    onTouchStart={handlePlaceOrder}
                    onKeyDown={handlePlaceOrderEnterKeyPress}
                    priority="high"
                    className={classes.place_order_button}
                    data-cy="CheckoutPage-placeOrderButton"
                    disabled={
                        isUpdating ||
                        placeOrderLoading ||
                        orderDetailsLoading ||
                        placeOrderButtonClicked
                    }
                >
                    <FormattedMessage
                        id={'checkoutPage.placeOrder'}
                        defaultMessage={'Place Order'}
                    />
                </Button>
            ) : null;

        // If we're on mobile we should only render price summary in/after review.
        const shouldRenderPriceSummary = !(
            isMobile && checkoutStep < CHECKOUT_STEP.REVIEW
        );

        const orderSummary = shouldRenderPriceSummary ? (
            <div
                className={
                    classes.summaryContainer +
                    (signInContainerVisible
                        ? ' ' + classes.signInContainerVisible
                        : '') +
                    (recaptchaWidgetProps.shouldRender
                        ? ' ' + classes.reCaptchaMargin
                        : '')
                }
            >
                <OrderSummary isUpdating={isUpdating} />
            </div>
        ) : null;

        let headerText;

        if (isGuestCheckout) {
            headerText = formatMessage({
                id: 'checkoutPage.guestCheckout',
                defaultMessage: 'Guest Checkout'
            });
        } else if (customer.default_shipping) {
            headerText = formatMessage({
                id: 'checkoutPage.reviewAndPlaceOrder',
                defaultMessage: 'Review and Place Order'
            });
        } else {
            headerText = formatMessage(
                {
                    id: 'checkoutPage.greeting',
                    defaultMessage: 'Welcome {firstname}!'
                },
                { firstname: customer.firstname }
            );
        }

        const checkoutContentClass =
            activeContent === 'checkout'
                ? classes.checkoutContent
                : classes.checkoutContent_hidden;

        const stockStatusMessageElement = (
            <Fragment>
                <FormattedMessage
                    id={'checkoutPage.stockStatusMessage'}
                    defaultMessage={
                        'An item in your cart is currently out-of-stock and must be removed in order to Checkout. Please return to your cart to remove the item.'
                    }
                />
                <Link className={classes.cartLink} to={'/cart'}>
                    <FormattedMessage
                        id={'checkoutPage.returnToCart'}
                        defaultMessage={'Return to Cart'}
                    />
                </Link>
            </Fragment>
        );
        checkoutContent = (
            <div className={checkoutContentClass}>
                <div className={classes.heading_container}>
                    <FormError
                        classes={{
                            root: classes.formErrors
                        }}
                        errors={formErrors}
                    />
                    <StockStatusMessage
                        cartItems={cartItems}
                        message={stockStatusMessageElement}
                    />
                    <h1
                        className={classes.heading}
                        data-cy="ChekoutPage-headerText"
                    >
                        {headerText}
                    </h1>
                </div>
                {signInContainerElement}
                <div className={classes.shipping_information_container}>
                    <ScrollAnchor ref={shippingInformationRef}>
                        <ShippingInformation
                            onSave={setShippingInformationDone}
                            onSuccess={scrollShippingInformationIntoView}
                            toggleActiveContent={toggleAddressBookContent}
                            toggleSignInContent={toggleSignInContent}
                            setGuestSignInUsername={setGuestSignInUsername}
                            resetShouldSubmit={resetReviewOrderButtonClicked}
                            shouldSubmit={reviewOrderButtonClicked}
                        />
                    </ScrollAnchor>

                    <Form>
                        <CreditCard
                            resetShouldSubmit={resetReviewOrderButtonClicked}
                            shouldSubmit={reviewOrderButtonClicked}
                            onPaymentSuccess={setPaymentInformationDone}
                        />
                    </Form>
                </div>
                <div className={classes.shipping_method_container}>
                    <ScrollAnchor ref={shippingMethodRef}>
                        {shippingMethodSection}
                    </ScrollAnchor>
                </div>
                <div className={classes.payment_information_container}>
                    {paymentInformationSection}
                </div>
                {priceAdjustmentsSection}
                {reviewOrderButton}
                {itemsReview}
                {orderSummary}
                {placeOrderButton}
                <GoogleReCaptcha {...recaptchaWidgetProps} />
            </div>
        );
    }

    const addressBookElement = !isGuestCheckout ? (
        <AddressBook
            activeContent={activeContent}
            toggleActiveContent={toggleAddressBookContent}
            onSuccess={scrollShippingInformationIntoView}
            showOverlay={showOverlay}
            setShowOverlay={setShowOverlay}
            suggestedAddress={suggestedAddress}
            setSuggestedAddress={setSuggestedAddress}
            validateAddress={validateAddress} 
            setValidateAddress={setValidateAddress}
        />
    ) : null;

    const signInElement = isGuestCheckout ? (
        <GuestSignIn
            key={guestSignInUsername}
            isActive={activeContent === 'signIn'}
            toggleActiveContent={toggleSignInContent}
            initialValues={{ email: guestSignInUsername }}
        />
    ) : null;

    return (
        <div className="checkout-container">
            <div className={classes.heading_container}>
                <h1
                    aria-live="polite"
                    className={classes.heading}
                    data-cy="ChekoutPage-heading"
                >
                    {heading}
                </h1>
            </div>
            <div className="checkout-inner">
                <div class="steps-block">
                    <ul>
                        <li className="active">
                            <h4>Shipping</h4>
                            <span className="number">1</span>
                            <span className="line" />
                        </li>
                        <li>
                            <span className="line" />
                            <span className="number">2</span>
                            <h4>Review & Payment</h4>
                        </li>
                    </ul>
                </div>
                <div className={classes.root} data-cy="CheckoutPage-root">
                    <StoreTitle>
                        {formatMessage({
                            id: 'checkoutPage.titleCheckout',
                            defaultMessage: 'Checkout'
                        })}
                    </StoreTitle>
                    {checkoutContent}
                    {addressBookElement}
                    {signInElement}
                </div>
            </div>
        </div>
    );
};

export default CheckoutPage;

CheckoutPage.propTypes = {
    classes: shape({
        root: string,
        checkoutContent: string,
        checkoutContent_hidden: string,
        heading_container: string,
        heading: string,
        cartLink: string,
        stepper_heading: string,
        shipping_method_heading: string,
        payment_information_heading: string,
        signInContainer: string,
        signInLabel: string,
        signInButton: string,
        empty_cart_container: string,
        shipping_information_container: string,
        shipping_method_container: string,
        payment_information_container: string,
        price_adjustments_container: string,
        items_review_container: string,
        summaryContainer: string,
        formErrors: string,
        review_order_button: string,
        place_order_button: string,
        signInContainerVisible: string,
        reCaptchaMargin: string
    })
};
