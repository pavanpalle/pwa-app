import React from 'react';
import { arrayOf, string, shape, number } from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { useStyle } from '@magento/venia-ui/lib/classify';

import defaultClasses from './orderTotal.module.css';

const OrderTotal = props => {
    const { classes: propClasses, data } = props;
    const {
        Order_Date,
        No,
        Salesperson_Code,
        Payment_Terms_Code,
        Shipment_Date,
        Shipping_Agent_Code,
        Shipping_Agent_Service_Code
    } = data;
    const classes = useStyle(defaultClasses, propClasses);

    return (
        <div className={classes.root}>
            <div className={classes.heading}>
                <FormattedMessage
                    id="orderDetails.orderTotal"
                    defaultMessage="Order Total"
                />
            </div>
            <div className={classes.subTotal}>
                <span>
                    <FormattedMessage
                        id="orderDetails.subtotal"
                        defaultMessage="Subtotal"
                    />
                </span>
                <span>
                    <FormattedMessage
                        id="orderDetails.orderDate"
                        defaultMessage={Order_Date}
                    />
                </span>
            </div>

            <div className={classes.tax}>
                <span>
                    <FormattedMessage
                        id="orderDetails.tax"
                        defaultMessage="Tax"
                    />
                </span>
                <span>
                    <FormattedMessage
                        id="orderDetails.No"
                        defaultMessage={No}
                    />
                </span>
            </div>
            <div className={classes.shipping}>
                <span>
                    <FormattedMessage
                        id="orderDetails.shipping"
                        defaultMessage="Shipping"
                    />
                </span>
                <span>
                    <FormattedMessage
                        id="orderDetails.salespersonCode"
                        defaultMessage={Salesperson_Code}
                    />
                </span>
            </div>
            <div className={classes.total}>
                <span>
                    <FormattedMessage
                        id="orderDetails.total"
                        defaultMessage="Total"
                    />
                </span>
                <span>
                    <FormattedMessage
                        id="orderDetails.paymentTermsCode"
                        defaultMessage={Payment_Terms_Code}
                    />
                </span>
            </div>
        </div>
    );
};

export default OrderTotal;

OrderTotal.propTypes = {
    classes: shape({
        root: string,
        heading: string,
        subTotal: string,
        discount: string,
        tax: string,
        shipping: string,
        total: string
    }),
    data: shape({
        discounts: arrayOf(
            shape({
                amount: shape({
                    currency: string,
                    value: number
                })
            })
        ),
        grand_total: shape({
            currency: string,
            value: number
        }),
        subtotal: shape({
            currency: string,
            value: number
        }),
        total_tax: shape({
            currency: string,
            value: number
        }),
        total_shipping: shape({
            currency: string,
            value: number
        })
    })
};
