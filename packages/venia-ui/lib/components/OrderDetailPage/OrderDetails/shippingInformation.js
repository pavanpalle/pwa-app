import React, { Fragment } from 'react';
import { arrayOf, shape, string } from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { useStyle } from '@magento/venia-ui/lib/classify';

import defaultClasses from './shippingInformation.module.css';

const ShippingInformation = props => {
    const { data, classes: propsClasses } = props;
    const classes = useStyle(defaultClasses, propsClasses);

    let shippingContentElement;

    if (data) {
        const {
            Ship_to_Address,
            Ship_to_City,
            Ship_to_Country_RegionCode,
            Ship_to_County,
            Ship_to_Name,
            Ship_to_Name2,
            Ship_to_PostCode
        } = data;

        const additionalAddressString = `${Ship_to_Address}, ${Ship_to_City}, ${Ship_to_County} ${Ship_to_PostCode} ${Ship_to_Country_RegionCode}`;
        const fullName = `${Ship_to_Name} ${Ship_to_Name2}`;

        shippingContentElement = (
            <Fragment>
                <span className={classes.name}>{fullName}</span>

                <div className={classes.additionalAddress}>
                    {additionalAddressString}
                </div>
                <div className={classes.additionalAddress}>
                    <FormattedMessage
                        id="orderDetails.shipPhoneNumber"
                        defaultMessage="+1 800-914-7774"
                    />
                </div>
                <div className={classes.additionalAddress}>
                    <FormattedMessage
                        id="orderDetails.shipEmail"
                        defaultMessage="customersuccess@boxercraft.com"
                    />
                </div>
            </Fragment>
        );
    } else {
        shippingContentElement = (
            <FormattedMessage
                id="orderDetails.noShippingInformation"
                defaultMessage="No shipping information"
            />
        );
    }

   
    return (
        <div
            className={classes.root}
            data-cy="OrderDetails-ShippingInformation-root"
        >
            <div className={classes.heading}>
                <FormattedMessage
                    id="orderDetails.shippingInfoLabel"
                    defaultMessage="Ship to Address"
                />
            </div>
            {shippingContentElement}
        </div>
    );
};

export default ShippingInformation;

ShippingInformation.propTypes = {
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
        street: arrayOf(string),
        telephone: string
    })
};
