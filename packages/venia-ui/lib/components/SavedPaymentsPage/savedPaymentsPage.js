import React, { Suspense, useMemo } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';

import { useSavedPaymentsPage } from '@magento/peregrine/lib/talons/SavedPaymentsPage/useSavedPaymentsPage';
import { useStyle } from '@magento/venia-ui/lib/classify';

import { StoreTitle } from '../Head';
import { Plus as AddIcon } from 'react-feather';
import { fullPageLoadingIndicator } from '../LoadingIndicator';

import defaultClasses from './savedPaymentsPage.module.css';
import CreditCard from './creditCard';
import LinkButton from '../LinkButton';
import Icon from '../Icon';
import { Form } from 'informed';

const AddCardModal = React.lazy(() => import('./addCardModal'));

const SavedPaymentsPage = props => {
    const talonProps = useSavedPaymentsPage();

    const {
        isLoading,
        savedPayments,
        addCard,
        toggleAddCard,
        handleAddPaymentMethod,
        isProcessing
    } = talonProps;

    const classes = useStyle(defaultClasses, props.classes);

    const { formatMessage } = useIntl();

    const savedPaymentElements = useMemo(() => {
        if (savedPayments.length) {
            return savedPayments.map(paymentDetails => (
                <CreditCard
                    key={paymentDetails.PaymentMethodId}
                    details={paymentDetails}
                    public_hash={paymentDetails?.PaymentMethodId}
                    {...paymentDetails}
                />
            ));
        } else {
            return null;
        }
    }, [savedPayments]);

    const noSavedPayments = useMemo(() => {
        if (!savedPayments.length) {
            return formatMessage({
                id: 'savedPaymentsPage.noSavedPayments',
                defaultMessage: 'You have no saved payments.'
            });
        } else {
            return null;
        }
    }, [savedPayments, formatMessage]);

    const title = formatMessage({
        id: 'savedPaymentsPage.title',
        defaultMessage: 'Saved Payments'
    });

    const savedPaymentsMessage = useMemo(() => {
        if (!savedPayments.length) {
            return formatMessage({
                id: 'savedPaymentsPage.noSavedPayments',
                defaultMessage: 'You have no saved payments.'
            });
        } else {
            return formatMessage(
                {
                    id: 'savedPaymentsPage.Message',
                    defaultMessage: 'You have {count} saved payments.'
                },
                { count: savedPayments.length }
            );
        }
    }, [savedPayments, formatMessage]);

    if (isLoading) {
        return fullPageLoadingIndicator;
    }
    const AddButton = (
        <LinkButton
            classes={{ root: classes.addButton }}
            disabled={addCard}
            onClick={toggleAddCard}
        >
            <Icon classes={{ icon: undefined }} size={16} src={AddIcon} />
            <span className={classes.addText}>
                <FormattedMessage
                    id={'storedPayments.addCard'}
                    defaultMessage={'Add Card'}
                />
            </span>
        </LinkButton>
    );

    return (
        <div className={classes.root}>
            <StoreTitle>{title}</StoreTitle>
            <div aria-live="polite" className={classes.heading}>
                {title}
                <div aria-live="polite" aria-label={savedPaymentsMessage} />
            </div>
            <div className={classes.content}>{savedPaymentElements}</div>
            <div className={classes.add}>{AddButton}</div>
            <div className={classes.noPayments}>{noSavedPayments}</div>
            <Suspense fallback={null}>
                <Form>
                <AddCardModal
                    onSuccess={toggleAddCard}
                    isOpen={addCard}
                    handleClose={toggleAddCard}
                    handleAddPaymentMethod={handleAddPaymentMethod}
                    isProcessing={isProcessing}
                />
                </Form>
            </Suspense>
        </div>
    );
};

export default SavedPaymentsPage;
