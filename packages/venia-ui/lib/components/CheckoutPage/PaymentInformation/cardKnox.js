import './index.css';
import React, { useEffect, useRef, useState } from 'react';
import WrappedIfield from './wrapped-ifield';
import { CARD_TYPE, CVV_TYPE, CardknoxApplePay } from '@cardknox/react-ifields';
import { useCardKnox } from '@magento/peregrine/lib/talons/CheckoutPage/PaymentInformation/useCardKnox';
import CardIcon from '../../CardIcon';

const CardKnox = props => {
    const {
        classes: propClasses,
        onPaymentSuccess: onSuccess,
        onPaymentReady: onReady,
        onPaymentError: onError,
        resetShouldSubmit,
        shouldSubmit,
        setPaymentHash
    } = props;

    const talonProps = useCardKnox({
        onSuccess,
        onReady,
        onError,
        shouldSubmit,
        resetShouldSubmit
    });

    const {
        shouldRequestPaymentNonce,
        onPaymentError,
        onPaymentSuccess,
        onPaymentReady,

        /**
         * `stepNumber` depicts the state of the process flow in credit card
         * payment flow.
         *
         * `0` No call made yet
         * `1` Billing address mutation intiated
         * `2` Braintree nonce requsted
         * `3` Payment information mutation intiated
         * `4` All mutations done
         */
        stepNumber
    } = talonProps;

    const [cardToken, setCardToken] = useState('');
    const [cvvToken, setCvvToken] = useState('');
    const [issuer, setIssuer] = useState('');
    const [isChecked, setIsChecked] = useState(false);

    const [expMonth, setExpMonth] = useState(new Date().getMonth() + 1);
    const [expYear, setExpYear] = useState(new Date().getFullYear());

    const cardRef = useRef();
    const cvvRef = useRef();
    const getCardToken = () => {
        cardRef.current.getToken();
    };
    const getCvvToken = () => {
        cvvRef.current.getToken();
    };

    const onCardToken = data => {
        setCardToken(data.xToken);
    };
    const onCvvToken = data => {
        setCvvToken(data.xToken);
    };

    const getCardAndCvvToken = () => {
        getCardToken();
        getCvvToken();
    };

    const getApplePayProperties = () => {
        return {
            merchantIdentifier: 'merchant.aptest.cardknoxdev.com',
            requiredShippingContactFields: ['postalAddress']
        };
    };

    const getExpiryDate = (expMonth, expYear) => {
        // Pad month with leading zero if needed
        const month = String(expMonth).padStart(2, '0');
        // Get last two digits of year
        const year = String(expYear).slice(-2);
        return month + year;
    };

    useEffect(() => {
        if (cardToken !== '') {
            setPaymentHash({
                paymentToken: cardToken,
                exp: getExpiryDate(expMonth, expYear),
                cvvToken: cvvToken,
                paymentMethod: 'cardknox',
                cardType: issuer,
                saveCard: isChecked
            });
        }
    }, [cardToken, cvvToken, expMonth, expYear, isChecked, issuer, setPaymentHash]);

    const getApplePayTransInfo = () => {
        const lineItems = [
            {
                label: 'Subtotal',
                type: 'final',
                amount: '1.0'
            },
            {
                label: 'Express Shipping',
                amount: '1.50',
                type: 'final'
            }
        ];
        const total = {
            type: 'final',
            label: 'Total',
            amount: '2.50'
        };
        return {
            lineItems,
            total
        };
    };

    const applePayPaymentAuthorize = paymentResponse => {
        return new Promise(function(resolve, reject) {
            try {
                console.log('applePayPaymentAuthorize', paymentResponse);
                resolve(paymentResponse);
            } catch (error) {
                console.error('onPaymentAuthorize error.', error);
                reject(error);
            }
        });
    };
    const handleChange = event => {
        setIsChecked(event.target.checked);
    };
    return (
        <div>
            <div className="main">
                <div className="columns">
                    <div className="column">
                        <section className="box card-box">
                            <div className="field">
                                <p className="label">Card Number</p>
                                <div className="control">
                                    <WrappedIfield
                                        ifieldType={CARD_TYPE}
                                        onIssuer={setIssuer}
                                        onToken={onCardToken}
                                        ref={cardRef}
                                    />
                                    {issuer && (
                                        <CardIcon
                                            cardType={issuer}
                                            width={57}
                                            height={36}
                                        />
                                    )}
                                </div>
                            </div>

                            <div className="field is-grouped mt-3">
                                <div className="field">
                                    <p className="label">Month</p>
                                    <div className="control">
                                        <div className="select">
                                            <select
                                                value={expMonth}
                                                onChange={e =>
                                                    setExpMonth(e.target.value)
                                                }
                                            >
                                                {[...Array(12).keys()].map(
                                                    i => (
                                                        <option
                                                            key={i + 1}
                                                            value={i + 1}
                                                        >
                                                            {i + 1}
                                                        </option>
                                                    )
                                                )}
                                            </select>
                                        </div>
                                    </div>
                                </div>
                                <div className="field">
                                    <p className="label">Year</p>
                                    <div className="control">
                                        <div className="select">
                                            <select
                                                value={expYear}
                                                onChange={e =>
                                                    setExpYear(e.target.value)
                                                }
                                            >
                                                {[...Array(10).keys()].map(
                                                    i => (
                                                        <option
                                                            key={i + 1}
                                                            value={
                                                                new Date().getFullYear() +
                                                                i
                                                            }
                                                        >
                                                            {new Date().getFullYear() +
                                                                i}
                                                        </option>
                                                    )
                                                )}
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="field">
                                <p className="label">CVV</p>
                                <div className="control">
                                    <WrappedIfield
                                        ifieldType={CVV_TYPE}
                                        issuer={issuer}
                                        onToken={onCvvToken}
                                        ref={cvvRef}
                                    />
                                </div>
                            </div>

                            <label>
                                <input
                                    type="checkbox"
                                    checked={isChecked}
                                    onChange={handleChange}
                                />
                                Save this card for future use
                            </label>

                            <div
                                style={{
                                    width: '175px',
                                    display: 'block',
                                    marginTop: '12px'
                                }}
                            >
                                <CardknoxApplePay
                                    enableLogging={true}
                                    properties={getApplePayProperties()}
                                    onGetTransactionInfo={getApplePayTransInfo}
                                    onPaymentAuthorize={
                                        applePayPaymentAuthorize
                                    }
                                />
                            </div>
                        </section>
                    </div>
                    {/* <div className="column">
                        <section className="box result-box">
                            <div className="field">
                                <p className="label">Card Token</p>
                                <p className="token-field">{cardToken}</p>
                            </div>
                        </section>
                    </div> */}
                </div>
            </div>
        </div>
    );
};

export default CardKnox;
