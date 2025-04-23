import React, { Fragment } from 'react';
import { useStyle } from '../../../classify';
import { useSavedCards } from '@magento/peregrine/lib/talons/CheckoutPage/PaymentInformation/useSavedCards';
import LoadingIndicator from '../../LoadingIndicator';
import { FormattedMessage } from 'react-intl';

import { Form } from 'informed';
import SavedCardRadios from './savedCardRadios';

const initializingContents = (
    <LoadingIndicator>
        <FormattedMessage
            id={'SavedCards.loading'}
            defaultMessage={'Loading saved cards...'}
        />
    </LoadingIndicator>
);

const SavedCards = props => {
    const { classes: propClasses , setPaymentHash} = props;
    const classes = useStyle({}, propClasses);
    const talonProps = useSavedCards({ setPaymentHash});

    const { isLoading, savedCards, handleSubmit, defaultCard } = talonProps;
    const deaultSavedCard = {
        paymentHash: defaultCard.Token,
    };
    let bodyContents = initializingContents;
    bodyContents = (
        <Form
            className={classes.form}
            initialValues={deaultSavedCard}
            onValueChange={handleSubmit}
            onSubmit={handleSubmit}
        >
            <SavedCardRadios disabled={isLoading} savedCards={savedCards} />
        </Form>
    );

    const contents = <div data-cy="SavedCards-root">{bodyContents}</div>;
   
    return <Fragment>{contents}</Fragment>;
};

export default SavedCards;
