import React, { useMemo } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { Heart } from 'react-feather';
import { gql } from '@apollo/client';
import { Link } from 'react-router-dom';
import { useProduct } from '@magento/peregrine/lib/talons/CartPage/ProductListing/useProduct';
import resourceUrl from '@magento/peregrine/lib/util/makeUrl';
import Price from '@magento/venia-ui/lib/components/Price';

import { useStyle } from '../../../classify';
import Icon from '../../Icon';
import Image from '../../Image';
import Kebab from '../../LegacyMiniCart/kebab';
//import ProductOptions from '../../LegacyMiniCart/productOptions';
import Section from '../../LegacyMiniCart/section';
import AddToListButton from '../../Wishlist/AddToListButton';
import Quantity from './quantity';

import defaultClasses from './product.module.css';

import { CartPageFragment } from '@magento/peregrine/lib/talons/CartPage/cartPageFragments.gql.js';
import { AvailableShippingMethodsCartFragment } from '@magento/peregrine/lib/talons/CartPage/PriceAdjustments/ShippingMethods/shippingMethodsFragments.gql.js';
const IMAGE_SIZE = 100;

const HeartIcon = <Icon size={16} src={Heart} />;

const Product = props => {
    const { item } = props;

    const { formatMessage } = useIntl();
    const talonProps = useProduct({
        operations: {
            removeItemMutation: REMOVE_ITEM_MUTATION,
            updateItemQuantityMutation: UPDATE_QUANTITY_MUTATION
        },
        ...props
    });

    const {
        addToWishlistProps,
        errorMessage,
        handleEditItem,
        handleRemoveFromCart,
        handleUpdateItemQuantity,
        isEditable,
        product,
        isProductUpdating,
    } = talonProps;

    const {
        currency,
        image,
        name,
        options,
        quantity,
        stockStatus,
        unitPrice,
        urlKey,
        urlSuffix,
        prices,
        configurable_options
    } = product;

    const classes = useStyle(defaultClasses, props.classes);

    const itemClassName = isProductUpdating
        ? classes.item_disabled
        : classes.item;

        const productName = name.split('-')[0]; 

    const editItemSection = isEditable ? (
        <Section
            text={formatMessage({
                id: 'product.editItem',
                defaultMessage: 'Edit item'
            })}
            data-cy="Product-Section-editItem"
            onClick={handleEditItem}
            icon="Edit2"
            classes={{
                text: classes.sectionText
            }}
        />
    ) : null;

    const itemLink = useMemo(
        () => resourceUrl(`/${urlKey}${urlSuffix || ''}`),
        [urlKey, urlSuffix]
    );

    const stockStatusMessage =
        stockStatus === 'OUT_OF_STOCK'
            ? formatMessage({
                  id: 'product.outOfStock',
                  defaultMessage: 'Out-of-stock'
              })
            : '';

    return (
        <li className={classes.root} data-cy="Product-root">
            <span className={classes.errorText}>{errorMessage}</span>
            <div className={itemClassName}>
                <ul className='cart-row-items'>
                    <li data-label="Product Details">
                <Link
                    to={itemLink}
                    className={classes.imageContainer}
                    data-cy="Product-imageContainer"
                >
                    <Image
                        alt={name}
                        classes={{
                            root: classes.imageRoot,
                            image: classes.image
                        }}
                        width={IMAGE_SIZE}
                        resource={image}
                        data-cy="Product-image"
                    />
                </Link>
                <div className={classes.details}>
                    <div className={classes.name} data-cy="Product-name">
                        <Link to={itemLink}>{productName}</Link>
                    </div>
                    <div  classes={{
                            options: classes.options,
                            optionLabel: classes.optionLabel
                        }}>Color : {name?.split("-")[2]}</div>
                    <div className="sku-value">SKU : {item.product.sku}</div>
                    <span className={classes.stockStatusMessage}>
                        {stockStatusMessage}
                    </span>
                    
                </div>
                </li>
                <li data-label="Size">
                <div  classes={{
                            options: classes.options,
                            optionLabel: classes.optionLabel
                        }}>Size : {name?.split("-")[1]}</div>
                     {/* <ProductOptions
                        options={productOptionsByName(name)}
                        classes={{
                            options: classes.options,
                            optionLabel: classes.optionLabel
                        }}
                    /> */}
                </li>
                <li data-label="Price">
                <span className={classes.price} data-cy="Product-price">
                        <Price currencyCode={currency} value={unitPrice} />
                        <FormattedMessage
                            id={'product.price'}
                            defaultMessage={' ea.'}
                        />
                    </span>    
                </li>
                <li data-label="Quantity">
                    <div className={classes.quantity}>
                        <Quantity
                            itemId={item.id}
                            initialValue={quantity}
                            onChange={handleUpdateItemQuantity}
                        />
                    </div>
                </li>
                <li data-label="Sub Total">
                    <span className='row-total'>${item.prices.row_total.value.toFixed(2)}</span>
                </li>
                <li data-label="Action">
                <Kebab
                    classes={{
                        root: classes.kebab
                    }}
                    disabled={true}
                >
                    {editItemSection}
                    <Section
                        text={formatMessage({
                            id: 'product.removeFromCart',
                            defaultMessage: 'Remove from cart'
                        })}
                        data-cy="Product-Section-removeFromCart"
                        onClick={handleRemoveFromCart}
                        icon="Trash"
                        classes={{
                            text: classes.sectionText
                        }}
                    />
                    <li>
                        <AddToListButton
                            {...addToWishlistProps}
                            classes={{
                                root: classes.addToListButton,
                                root_selected: classes.addToListButton_selected
                            }}
                            icon={HeartIcon}
                        />
                    </li>
                </Kebab>
                </li>
                </ul>
            </div>
        </li>
    );
};

export default Product;

export const REMOVE_ITEM_MUTATION = gql`
    mutation removeItem($cartId: String!, $itemId: ID!) {
        removeItemFromCart(
            input: { cart_id: $cartId, cart_item_uid: $itemId }
        ) {
            cart {
                id
                ...CartPageFragment
                ...AvailableShippingMethodsCartFragment
            }
        }
    }
    ${CartPageFragment}
    ${AvailableShippingMethodsCartFragment}
`;

export const UPDATE_QUANTITY_MUTATION = gql`
    mutation updateItemQuantity(
        $cartId: String!
        $itemId: ID!
        $quantity: Float!
    ) {
        updateCartItems(
            input: {
                cart_id: $cartId
                cart_items: [{ cart_item_uid: $itemId, quantity: $quantity }]
            }
        ) {
            cart {
                id
                ...CartPageFragment
                ...AvailableShippingMethodsCartFragment
            }
        }
    }
    ${CartPageFragment}
    ${AvailableShippingMethodsCartFragment}
`;
