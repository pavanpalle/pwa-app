import React from 'react';
import { shape, arrayOf, string, number } from 'prop-types';

import { useStyle } from '@magento/venia-ui/lib/classify';

import Item from './item';

import defaultClasses from './items.module.css';
import { FormattedMessage } from 'react-intl';

const Items = props => {
    const { handleContentToggle, isOpen } = props;
    const { lineItems } = props.data;
    const classes = useStyle(defaultClasses, props.classes);

    const products = lineItems.map(item => {
        // Clean up style, description for display
        const style = item.style || '';
        const description = item.description || '';
        const formattedDescription = description
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');

        return {
            ...item,
            name: `${formattedDescription}`, // Use actual description from data
            displayColor: item.color || '',
            sku: style
        };
    });
    const itemsComponent = products.map((item,index) => (
        <Item
            key={item.id}
            item={item}
            handleContentToggle={handleContentToggle}
            isOpen={isOpen}
            index={index}
        />
    ));

    // Calculate totals
    const totalQuantity = products.reduce(
        (sum, product) => sum + product.total_quantity,
        0
    );
    const totalAmount = products.reduce(
        (sum, product) => sum + product.unit_price * product.total_quantity,
        0
    );
    const averageUnitPrice = totalAmount / totalQuantity || 0;

    return (
        <div className={classes.root} data-cy="OrderDetails-Items-root">
            {/* <h3 className={classes.heading}>
                <FormattedMessage
                    id="orderItems.itemsHeading"
                    defaultMessage="Items"
                />
            </h3> */}
            <div className={classes.itemsTable}>
                <div className={classes.itemsHeading}>
                    <FormattedMessage
                        id="orderItems.productDetails"
                        defaultMessage="PRODUCT DETAILS"
                    />
                </div>
                <div className={classes.itemsHeadingLables}>
                    <FormattedMessage
                        id="orderItems.quantity"
                        defaultMessage="QUANTITY"
                    />
                </div>
                <div className={classes.itemsHeadingLables}>
                    <FormattedMessage
                        id="orderItems.unitPrice"
                        defaultMessage="UNIT PRICE"
                    />
                </div>
                <div className={classes.itemsHeadingLables}>
                    <FormattedMessage
                        id="orderItems.amount"
                        defaultMessage="AMOUNT"
                    />
                </div>
            </div>
            <div
                // className={classes.orderHistoryTable}
                data-cy="OrderHistoryPage-orderHistoryTable"
            >
                {itemsComponent}
            </div>

            <div className="flex items-center justify-end p-4 font-semibold">
                <div className="w-1/6 text-right pr-4">Total</div>
                <div className="w-1/6 text-center">{totalQuantity}</div>
                <div className="w-1/6 text-center">
                    ${averageUnitPrice.toFixed(2)}
                </div>
                <div className="w-1/6 text-center">
                    ${totalAmount.toFixed(2)}
                </div>
                <div className="w-1/6" />
            </div>

            {/* <div className={classes.itemsContainer}>{itemsComponent}</div> */}
        </div>
    );
};

export default Items;

Items.propTypes = {
    classes: shape({
        root: string
    }),
    data: shape({
        items: arrayOf(
            shape({
                id: string,
                product_name: string,
                product_sale_price: shape({
                    currency: string,
                    value: number
                }),
                product_sku: string,
                product_url_key: string,
                selected_options: arrayOf(
                    shape({
                        label: string,
                        value: string
                    })
                ),
                quantity_ordered: number
            })
        ),
        imagesData: arrayOf(
            shape({
                id: number,
                sku: string,
                thumbnail: shape({
                    url: string
                }),
                url_key: string,
                url_suffix: string
            })
        )
    })
};
