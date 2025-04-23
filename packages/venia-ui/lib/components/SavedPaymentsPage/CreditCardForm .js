import React, { useEffect, useRef, useState } from 'react';
import WrappedIfield from '../CheckoutPage/PaymentInformation/wrapped-ifield';
import { CARD_TYPE, CVV_TYPE } from '@cardknox/react-ifields';
import defaultClasses from './creditCardForm.module.css';
import { useStyle } from '../../classify';
import Checkbox from '../Checkbox';
import { FormattedMessage } from 'react-intl';
const CreditCardForm = props => {
    const {
        classes: propClasses,
        handleClose,
        handleAddPaymentMethod,
        isProcessing
    } = props;

    const classes = useStyle(defaultClasses, propClasses);

    const [cardToken, setCardToken] = useState('');
    const [cvvToken, setCvvToken] = useState('');
    const [issuer, setIssuer] = useState('');

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

    // const onCardToken = (data) => {
    //   setCardToken(data.xToken);
    // };
    // const onCvvToken = (data) => {
    //   setCvvToken(data.xToken);
    // };

    const getCardAndCvvToken = () => {
        getCardToken();
        getCvvToken();
    };

    //     const [cardToken, setCardToken] = useState('');
    // const [cvvToken, setCvvToken] = useState('');
    // const [issuer, setIssuer] = useState('');
    // const [expMonth, setExpMonth] = useState(new Date().getMonth() + 1);
    // const [expYear, setExpYear] = useState(new Date().getFullYear());
    // Refs

    // const [isFormValid, setIsFormValid] = useState(false);
    // const [formErrors, setFormErrors] = useState({
    //   card: '',
    //   cvv: '',
    //   expiry: ''
    // });
    // const [isProcessing, setIsProcessing] = useState(false);
    // const [isComplete, setIsComplete] = useState(false);

    // // Validate expiry date
    // useEffect(() => {
    //   const validateExpiryDate = () => {
    //     const currentDate = new Date();
    //     const currentMonth = currentDate.getMonth() + 1;
    //     const currentYear = currentDate.getFullYear();

    //     if (expYear < currentYear || (expYear === currentYear && expMonth < currentMonth)) {
    //       setFormErrors(prev => ({ ...prev, expiry: 'Card has expired' }));
    //     } else {
    //       setFormErrors(prev => ({ ...prev, expiry: '' }));
    //     }
    //   };

    //   validateExpiryDate();
    // }, [expMonth, expYear]);

    // // Check if form is valid when tokens or errors change
    // useEffect(() => {
    //   const isValid = cardToken && cvvToken && !formErrors.card && !formErrors.cvv && !formErrors.expiry;
    //   setIsFormValid(isValid);
    // }, [cardToken, cvvToken, formErrors]);

    // const onCardToken = (data) => {
    //   if (data.xToken) {
    //     setCardToken(data.xToken);
    //     setFormErrors(prev => ({ ...prev, card: '' }));
    //   } else {
    //     setFormErrors(prev => ({ ...prev, card: 'Invalid card number' }));
    //   }
    // };

    // const onCvvToken = (data) => {
    //   if (data.xToken) {
    //     setCvvToken(data.xToken);
    //     setFormErrors(prev => ({ ...prev, cvv: '' }));
    //   } else {
    //     setFormErrors(prev => ({ ...prev, cvv: 'Invalid CVV' }));
    //   }
    // };

    // const onCardError = (error) => {
    //   setFormErrors(prev => ({ ...prev, card: error.message || 'Card validation failed' }));
    // };

    // const onCvvError = (error) => {
    //   setFormErrors(prev => ({ ...prev, cvv: error.message || 'CVV validation failed' }));
    // };

    const onIssuerChange = issuerData => {
        setIssuer(issuerData);
    };

    const handle3DSResults = results => {
        console.log('3DS Results:', results);
    };

    // const handleSubmit = () => {
    //   if (!isFormValid) {
    //     return;
    //   }

    //   setIsProcessing(true);

    //   // Mock payment processing
    //   setTimeout(() => {
    //     setIsProcessing(false);
    //     setIsComplete(true);
    //   }, 1500);
    // };

    // const resetForm = () => {
    //   setCardToken('');
    //   setCvvToken('');
    //   setIsComplete(false);

    //   // Clear the ifields
    //   if (cardRef.current) cardRef.current.clearIfield();
    //   if (cvvRef.current) cvvRef.current.clearIfield();
    // };

    const [isFormValid, setIsFormValid] = useState(false);
    const [formErrors, setFormErrors] = useState({
        card: '',
        cvv: '',
        expiry: ''
    });
    //const [isProcessing, setIsProcessing] = useState(false);
    //const [isComplete, setIsComplete] = useState(false);

    // Validate expiry date
    useEffect(() => {
        validateExpiryDate();
    }, [expMonth, expYear]);

    // Check if form is valid when tokens or errors change
    useEffect(() => {
        const isValid =
            cardToken &&
            cvvToken &&
            !formErrors.card &&
            !formErrors.cvv &&
            !formErrors.expiry;
        setIsFormValid(isValid);
    }, [cardToken, cvvToken, formErrors]);

    const onCardToken = data => {
        if (data.xToken) {
            setCardToken(data.xToken);
            setFormErrors(prev => ({ ...prev, card: '' }));
        } else {
            setFormErrors(prev => ({ ...prev, card: 'Invalid card number' }));
        }
    };

    const onCvvToken = data => {
        if (data.xToken) {
            setCvvToken(data.xToken);
            setFormErrors(prev => ({ ...prev, cvv: '' }));
        } else {
            setFormErrors(prev => ({ ...prev, cvv: 'Invalid CVV' }));
        }
    };

    const onCardError = error => {
        setFormErrors(prev => ({
            ...prev,
            card: error.message || 'Card validation failed'
        }));
    };

    const onCvvError = error => {
        setFormErrors(prev => ({
            ...prev,
            cvv: error.message || 'CVV validation failed'
        }));
    };

    const validateExpiryDate = () => {
        const currentDate = new Date();
        const currentMonth = currentDate.getMonth() + 1;
        const currentYear = currentDate.getFullYear();

        if (
            expYear < currentYear ||
            (expYear === currentYear && expMonth < currentMonth)
        ) {
            setFormErrors(prev => ({ ...prev, expiry: 'Card has expired' }));
        } else {
            setFormErrors(prev => ({ ...prev, expiry: '' }));
        }
    };

    const handleSubmit = () => {
        if (!isFormValid) {
            return;
        }

        handleAddPaymentMethod({
            token: cardToken,
            cvv: cvvToken,
            expMonth,
            expYear
        });
    };

    return (
        <div className={classes.container}>
            <div className={classes.formCard}>
                <div className={classes.formHeader}>
                    <h2 className={classes.formTitle}>Add New Card</h2>
                </div>

                <div className={classes.formBody}>
                    <div className={classes.formGroup}>
                        <span className={classes.formLabel}>Card Number</span>
                        <WrappedIfield
                            ifieldType={CARD_TYPE}
                            onToken={onCardToken}
                            onError={onCardError}
                            onIssuer={onIssuerChange}
                            issuer={issuer}
                            handle3DSResults={handle3DSResults}
                            ref={cardRef}
                            className={classes.mockIfield}
                        />
                        {formErrors.card && (
                            <p className={classes.errorText}>
                                {formErrors.card}
                            </p>
                        )}
                    </div>

                    <div className={classes.formFlex}>
                        <div className={classes.formHalf}>
                            <span className={classes.formLabel}>
                                Expiration Date
                            </span>
                            <div className={classes.expiryFlex}>
                                <div className={classes.expiryMonth}>
                                    <select
                                        className={classes.selectField}
                                        value={expMonth}
                                        onChange={e =>
                                            setExpMonth(
                                                parseInt(e.target.value)
                                            )
                                        }
                                    >
                                        {[...Array(12).keys()].map(i => (
                                            <option key={i + 1} value={i + 1}>
                                                {(i + 1)
                                                    .toString()
                                                    .padStart(2, '0')}
                                            </option>
                                        ))}
                                    </select>
                                    <div className={classes.selectArrow}>
                                        <svg
                                            className="fill-current h-4 w-4"
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 20 20"
                                        >
                                            <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                                        </svg>
                                    </div>
                                </div>
                                <span className={classes.expirySlash}>/</span>
                                <div className={classes.expiryYear}>
                                    <select
                                        className={classes.selectField}
                                        value={expYear}
                                        onChange={e =>
                                            setExpYear(parseInt(e.target.value))
                                        }
                                    >
                                        {[...Array(10).keys()].map(i => (
                                            <option
                                                key={i}
                                                value={
                                                    new Date().getFullYear() + i
                                                }
                                            >
                                                {new Date().getFullYear() + i}
                                            </option>
                                        ))}
                                    </select>
                                    <div className={classes.selectArrow}>
                                        <svg
                                            className="fill-current h-4 w-4"
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 20 20"
                                        >
                                            <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                            {formErrors.expiry && (
                                <p className={classes.errorText}>
                                    {formErrors.expiry}
                                </p>
                            )}
                        </div>

                        <div className={classes.formHalf}>
                            <span className={classes.formLabel}>CVV</span>
                            <WrappedIfield
                                ifieldType={CVV_TYPE}
                                onToken={onCvvToken}
                                onError={onCvvError}
                                issuer={issuer}
                                ref={cvvRef}
                                className={classes.mockIfield}
                            />
                            {formErrors.cvv && (
                                <p className={classes.errorText}>
                                    {formErrors.cvv}
                                </p>
                            )}
                        </div>
                    </div>
                    {/* <Checkbox
                        data-cy="SavedPaymentsPage-saveCard"
                        field="saveCard"
                        label={FormattedMessage({
                            id: 'SavedPaymentsPage.saveCard',
                            defaultMessage: 'Save card for future use.'
                        })}
                        //initialValue={false}
                    /> */}
                    <div className={classes.buttonContainer}>
                        <button
                            className={`${classes.submitButton} ${
                                isFormValid
                                    ? classes.submitButtonEnabled
                                    : classes.submitButtonDisabled
                            } ${
                                isProcessing
                                    ? classes.submitButtonProcessing
                                    : ''
                            }`}
                            onClick={handleSubmit}
                            disabled={!isFormValid || isProcessing}
                        >
                            {isProcessing ? (
                                <div className={classes.spinnerContainer}>
                                    <svg
                                        className={classes.spinner}
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                    >
                                        <circle
                                            className="opacity-25"
                                            cx="12"
                                            cy="12"
                                            r="10"
                                            stroke="currentColor"
                                            strokeWidth="4"
                                        />
                                        <path
                                            className="opacity-75"
                                            fill="currentColor"
                                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                        />
                                    </svg>
                                    Processing...
                                </div>
                            ) : (
                                'Submit'
                            )}
                        </button>
                    </div>

                    {cardToken && (
                        <div className={classes.tokenDisplay}>
                            <div className={classes.tokenText}>
                                <span className={classes.tokenLabel}>
                                    Card Token:
                                </span>
                                <span className={classes.tokenValue}>
                                    {cardToken}
                                </span>
                            </div>
                        </div>
                    )}

                    {cardToken && (
                        <div className={classes.tokenDisplay}>
                            <div className={classes.tokenText}>
                                <span className={classes.tokenLabel}>
                                    CVV Token:
                                </span>
                                <span className={classes.tokenValue}>
                                    {cvvToken}
                                </span>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>

        // <div>
        //      <div className='main'>

        //             <div className='columns'>
        //               <div className='column'>
        //                 <section className='box card-box'>

        //                   <div className='field'>
        //                     <p className="label">Card Number</p>
        //                     <div className="control">
        //                       <WrappedIfield ifieldType={CARD_TYPE} onIssuer={setIssuer} onToken={onCardToken} ref={cardRef} />
        //                     </div>
        //                   </div>

        //                   <div className="field is-grouped mt-3">
        //                     <div className='field'>
        //                       <p className="label">Month</p>
        //                       <div className="control">
        //                         <div className="select">
        //                           <select value={expMonth} onChange={(e) => setExpMonth(e.target.value)}>
        //                             {[...Array(12).keys()].map((i) => <option key={i + 1} value={i + 1}>{i + 1}</option>)}
        //                           </select>
        //                         </div>
        //                       </div>
        //                     </div>
        //                     <div className='field'>
        //                       <p className="label">Year</p>
        //                       <div className="control">
        //                         <div className="select">
        //                           <select value={expYear} onChange={(e) => setExpYear(e.target.value)}>
        //                             {[...Array(10).keys()].map((i) => <option key={i + 1} value={new Date().getFullYear() + i}>{new Date().getFullYear() + i}</option>)}
        //                           </select>
        //                         </div>
        //                       </div>
        //                     </div>
        //                   </div>
        //                   <div className='field'>
        //                     <p className="label">CVV</p>
        //                     <div className="control">
        //                       <WrappedIfield ifieldType={CVV_TYPE} issuer={issuer} onToken={onCvvToken} ref={cvvRef} />
        //                     </div>
        //                   </div>
        //                   {/* <button className="button is-info is-rounded is-small" onClick={focusCvv}>Focus</button>
        //                   <button className="button is-info is-rounded is-small" onClick={clearCvv}>Clear</button> */}
        //                   <button className="button is-info is-rounded is-small" onClick={getCardAndCvvToken}>Submit</button>

        //                 </section>
        //               </div>
        //               <div className='column'>
        //                 <section className='box result-box'>
        //                   <div className='field'>
        //                     <p className='label'>Card Token</p>
        //                     <p className='token-field'>{cardToken}</p>
        //                   </div>

        //                 </section>
        //               </div>
        //             </div>
        //           </div>
        // </div>
    );
};

export default CreditCardForm;
