import React from 'react';
import { arrayOf, shape, string } from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { useStyle } from '@magento/venia-ui/lib/classify';

import defaultClasses from './billingInformation.module.css';

const BillingInformation = props => {
    const { data, classes: propsClasses } = props;
    const {
        Bill_to_Address,
        Bill_to_City,
        Bill_to_Country_RegionCode,
        Bill_to_County,
        Bill_to_Name,
        Bill_to_Name2,
        Bill_to_PostCode,
        Bill_to_Contact
    } = data;

    const additionalAddressString = `${Bill_to_Address}, ${Bill_to_City}, ${Bill_to_County} ${Bill_to_PostCode} ${Bill_to_Country_RegionCode}`;
    const fullName = `${Bill_to_Name} ${Bill_to_Name2}`;
    const classes = useStyle(defaultClasses, propsClasses);

    return (
        <div
            className={classes.root}
            data-cy="OrderDetails-BillingInformation-root"
        >
            <div className={classes.heading}>
                <FormattedMessage
                    id="orderDetails.billingInfoLabel"
                    defaultMessage="Bill to Address"
                />
            </div>
            <span className={classes.name}>{fullName}</span>

            <div className={classes.additionalAddress}>
                {additionalAddressString}
            </div>
            <div className={classes.additionalAddress}>
                <FormattedMessage
                    id="orderDetails.billPhoneNumber"
                    defaultMessage="+1 800-914-7774"
                />
            </div>
            <div className={classes.additionalAddress}>
                {Bill_to_Contact}
            </div>
        </div>
    );
};

export default BillingInformation;

BillingInformation.propTypes = {
    classes: shape({
        root: string,
        heading: string,
        name: string,
        streetRow: string,
        additionalAddress: string
    }),
    data: shape({
        city: string,
        country_code: string,
        firstname: string,
        lastname: string,
        postcode: string,
        region: string,
        street: arrayOf(string)
    })
};
