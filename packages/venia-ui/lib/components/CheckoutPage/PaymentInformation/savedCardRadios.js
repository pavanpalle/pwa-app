import React, { Fragment } from 'react';
import { useIntl } from 'react-intl';
import { arrayOf, bool, number, shape, string } from 'prop-types';

import { useStyle } from '../../../classify';
import RadioGroup from '../../RadioGroup';
import defaultClasses from './savedCardRadios.module.css';

const SavedCardRadios = props => {
    const { disabled, savedCards } = props;
    const { formatMessage } = useIntl();

    const classes = useStyle(defaultClasses, props.classes);

    const ERROR_MESSAGE = formatMessage({
        id: 'savedCardRadios.errorLoading',
        defaultMessage:
            'Error loading saved cards. Please ensure a saved cards is set and try again.'
    });

    if (!savedCards.length) {
        return <span className={classes.error}>{ERROR_MESSAGE}</span>;
    }

    const radioGroupClasses = {
        message: classes.radioMessage,
        radioLabel: classes.radioLabel,
        root: classes.radioRoot
    };

    const shippingRadios = savedCards.map(method => {
        const label = (
            <Fragment>
                <span data-cy="SavedCardRadio-name">{method.MaskedNumber}</span>
                <span data-cy="SavedCardRadio-default" className={classes.default}>{method.IsDefaultPaymentMethod?"Default":""}</span>
            </Fragment>
        );
        const value = method.Token;

        return { label, value };
    });

    return (
        <RadioGroup
            classes={radioGroupClasses}
            disabled={disabled}
            field="paymentHash"
            id={'savedCard'}
            items={shippingRadios}
        />
    );
};

export default SavedCardRadios;

SavedCardRadios.propTypes = {
    classes: shape({
        error: string,
        radioMessage: string,
        radioLabel: string,
        radioRoot: string
    }),
    disabled: bool,
    shippingMethods: arrayOf(
        shape({
            amount: shape({
                currency: string,
                value: number
            }),
            available: bool,
            carrier_code: string,
            carrier_title: string,
            method_code: string,
            method_title: string,
            serializedValue: string.isRequired
        })
    ).isRequired
};
