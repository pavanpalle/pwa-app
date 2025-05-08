import { arrayOf, number, shape, string } from 'prop-types';
import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'react-feather';

import { useStyle } from '@magento/venia-ui/lib/classify';
import Icon from '../../Icon';
import Image from '../../Image';
import PlaceholderImage from '../../Image/placeholderImage';
import defaultClasses from './item.module.css';

const Item = props => {
    const { item, index } = props;
    const {
        description,
        imageurl,
        sizes,
        total_quantity,
        unit_price,
        name,
        displayColor,
        sku
    } = item;

    const [expandedItems, setExpandedItems] = useState({});

    const classes = useStyle(defaultClasses, props.classes);

    const thumbnailProps = {
        alt: description,
        classes: { root: classes.thumbnail },
        width: 50
    };
    const thumbnailElement = imageurl ? (
        <Image {...thumbnailProps} resource={imageurl} />
    ) : (
        <PlaceholderImage {...thumbnailProps} />
    );

    const contentToggleIconSrc = expandedItems[index] ? ChevronUp : ChevronDown;

    const contentToggleIcon = <Icon src={contentToggleIconSrc} size={24} />;
    const toggleItem = id => {
        setExpandedItems(prev => ({
            ...prev,
            [id]: !prev[id]
        }));
    };
    return (
        <div className={classes.root}>
            <div>
                <div className={classes.thumbnailContainer}>
                    {thumbnailElement}
                </div>

                <div className="font-semibold text-gray-800">{name}</div>
                <div className="text-sm text-gray-600">
                    Color: {displayColor}
                </div>
                <div className="text-sm text-gray-600">SKU: {sku}</div>
            </div>
            <div className={classes.totalQuantity}>{total_quantity}</div>

            <div className={classes.totalQuantity}>
                ${unit_price ? unit_price.toFixed(2) : '0.00'}
            </div>

            <div className={classes.totalQuantity}>
                $
                {unit_price ? (unit_price * total_quantity).toFixed(2) : '0.00'}
            </div>

            <button
                className={classes.contentToggleContainer}
                onClick={() => toggleItem(index)}
                type="button"
                aria-expanded={expandedItems}
            >
                {contentToggleIcon}
            </button>
            {expandedItems[index] && (
                <div className="w-full bg-gray-50 px-4">
                    <div className="grid grid-cols-4 gap-4 py-2 border-b border-gray-200 text-sm font-semibold text-gray-600">
                        <div className="px-4">Size</div>
                        <div className="px-4">Pending Qty</div>
                        <div className="px-4">Invoiced Qty</div>
                        <div className="px-4">Shipped Qty</div>
                    </div>
                    {sizes.map((size, sizeIndex) => (
                        <div
                            key={sizeIndex}
                            className="grid grid-cols-4 gap-4 py-2 border-b border-gray-100 text-sm"
                        >
                            <div className="px-4">{size.size}</div>
                            <div className="px-4">{size.Quantity}</div>
                            <div className="px-4">{size.Qty_Invoiced}</div>
                            <div className="px-4">{size.Qty_Shipped}</div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Item;

Item.propTypes = {
    classes: shape({
        root: string,
        thumbnailContainer: string,
        thumbnail: string,
        name: string,
        options: string,
        quantity: string,
        price: string,
        buyAgainButton: string
    }),
    product_name: string.isRequired,
    product_sale_price: shape({
        currency: string,
        value: number
    }).isRequired,
    product_url_key: string.isRequired,
    quantity_ordered: number.isRequired,
    selected_options: arrayOf(
        shape({
            label: string,
            value: string
        })
    ).isRequired,
    thumbnail: shape({
        url: string
    })
};
