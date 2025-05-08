import { shape, string } from 'prop-types';
import React, { Fragment } from 'react';
import { FormattedMessage } from 'react-intl';

import { useStyle } from '@magento/venia-ui/lib/classify';

import defaultClasses from './companyInformation.module.css';

const CompanyInformation = props => {
    const { data, classes: propsClasses } = props;
    const classes = useStyle(defaultClasses, propsClasses);

    let companyContentElement;

    if(data){

        companyContentElement = (
            <Fragment>
                <div className={classes.additionalAddress}>
                    <FormattedMessage
                        id="orderDetails.companyAddress"
                        defaultMessage={'7131 Discovery Blvd, Mableton GA 30126, United States'}
                    />
                </div>
                <div className={classes.additionalAddress}>
                    <div className={classes.heading}>
                        <FormattedMessage
                            id="orderDetails.companyPhoneLabel"
                            defaultMessage="Phone Number:"
                        />
                    </div>
                    <FormattedMessage
                        id="orderDetails.companyPhoneNumber"
                        defaultMessage="+1 800-914-7774"
                    />
                </div>
                <div className={classes.additionalAddress}>
                <div className={classes.heading}>
                        <FormattedMessage
                            id="orderDetails.companyEmailLabel"
                            defaultMessage="Email:"
                        />
                    </div>
                    <FormattedMessage
                        id="orderDetails.companyEmail"
                        defaultMessage="customersuccess@boxercraft.com"
                    />
                </div>
            </Fragment>
        );
    } else {
        companyContentElement = (
            <FormattedMessage
                id="orderDetails.noShippingInformation"
                defaultMessage="No shipping information"
            />
        );
    }

    return (
        <div
            className={classes.root}
            data-cy="OrderDetails-CompanyInformation-root"
        >
            <div className={classes.heading}>
                <FormattedMessage
                    id="orderDetails.companyInformationLabel"
                    defaultMessage="Boxercraft Inc."
                />
            </div>
            {companyContentElement}
        </div>
    );
};

export default CompanyInformation;

CompanyInformation.propTypes = {
    classes: shape({
        root: string,
        heading: string,
        name: string,
        streetRow: string,
        additionalAddress: string
    }),
    data: shape({
        Ship_to_Address: string,
        Ship_to_City: string,
        Ship_to_Country_RegionCode: string,
        Ship_to_County: string,
        Ship_to_Name: string,
        Ship_to_Name2: string,
        Ship_to_PostCode: string
    })
};
