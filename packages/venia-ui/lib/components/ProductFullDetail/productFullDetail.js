/* eslint-disable react/jsx-no-literals */
import { Form } from 'informed';
import { arrayOf, bool, number, shape, string } from 'prop-types';
import React, { Fragment, Suspense } from 'react';
import { Info } from 'react-feather';
import { FormattedMessage, useIntl } from 'react-intl';

import { useProductFullDetail } from '@magento/peregrine/lib/talons/ProductFullDetail/useProductFullDetail';
import { isProductConfigurable } from '@magento/peregrine/lib/util/isProductConfigurable';
import Price from '@magento/venia-ui/lib/components/Price';

import { useStyle } from '../../classify';
import Breadcrumbs from '../Breadcrumbs';
import Button from '../Button';
import CompanionStyles from '../CompanionStyles';
import ComparableStyles from '../ComparableStyles';
import FormError from '../FormError';
import Image from '../Image';
import Carousel from '../ProductImageCarousel';
import { ProductOptionsShimmer } from '../ProductOptions';
import RichContent from '../RichContent/richContent';
import defaultClasses from './productFullDetail.module.css';
import addCartIcon from './shopping-cart.png';

const WishlistButton = React.lazy(() => import('../Wishlist/AddToListButton'));
const Options = React.lazy(() => import('../ProductOptions'));

// Correlate a GQL error message to a field. GQL could return a longer error
// string but it may contain contextual info such as product id. We can use
// parts of the string to check for which field to apply the error.
const ERROR_MESSAGE_TO_FIELD_MAPPING = {
    'The requested qty is not available': 'quantity',
    'Product that you are trying to add is136 not available.': 'quantity',
    "The product that was requested doesn't exist.": 'quantity'
};

// Field level error messages for rendering.
const ERROR_FIELD_TO_MESSAGE_MAPPING = {
    quantity: 'The requested quantity is not available.'
};

const ProductFullDetail = props => {
    const { product } = props;

    const talonProps = useProductFullDetail({ product });

    const {
        breadcrumbCategoryId,
        errorMessage,
        handleAddToCart,
        handleSelectionChange,
        isOutOfStock,
        isEverythingOutOfStock,
        outOfStockVariants,
        isAddToCartDisabled,
        isSupportedProductType,
        mediaGalleryEntries,
        productDetails,
        wishlistButtonProps,
        getProductDetailsByColor,
        sizesTable,
        handleQuantityChange,
        isSignedIn
    } = talonProps;

    const { formatMessage } = useIntl();

    const classes = useStyle(defaultClasses, props.classes);

    const options = isProductConfigurable(product) ? (
        <Suspense fallback={<ProductOptionsShimmer />}>
            <Options
                onSelectionChange={handleSelectionChange}
                options={product.configurable_options}
                isEverythingOutOfStock={isEverythingOutOfStock}
                outOfStockVariants={outOfStockVariants}
                getProductDetailsByColor={getProductDetailsByColor}
                from={'productPage'}
            />
        </Suspense>
    ) : null;

    const breadcrumbs = breadcrumbCategoryId ? (
        <Breadcrumbs
            categoryId={breadcrumbCategoryId}
            currentProduct={productDetails.name}
        />
    ) : null;

    // Fill a map with field/section -> error.
    const errors = new Map();
    if (errorMessage) {
        Object.keys(ERROR_MESSAGE_TO_FIELD_MAPPING).forEach(key => {
            if (errorMessage.includes(key)) {
                const target = ERROR_MESSAGE_TO_FIELD_MAPPING[key];
                const message = ERROR_FIELD_TO_MESSAGE_MAPPING[target];
                errors.set(target, message);
            }
        });

        // Handle cases where a user token is invalid or expired. Preferably
        // this would be handled elsewhere with an error code and not a string.
        if (errorMessage.includes('The current user cannot')) {
            errors.set('form', [
                new Error(
                    formatMessage({
                        id: 'productFullDetail.errorToken',
                        defaultMessage:
                            'There was a problem with your cart. Please sign in again and try adding the item once more.'
                    })
                )
            ]);
        }

        // Handle cases where a cart wasn't created properly.
        if (
            errorMessage.includes('Variable "$cartId" got invalid value null')
        ) {
            errors.set('form', [
                new Error(
                    formatMessage({
                        id: 'productFullDetail.errorCart',
                        defaultMessage:
                            'There was a problem with your cart. Please refresh the page and try adding the item once more.'
                    })
                )
            ]);
        }

        // An unknown error should still present a readable message.
        if (!errors.size) {
            errors.set('form', [
                new Error(
                    formatMessage({
                        id: 'productFullDetail.errorUnknown',
                        defaultMessage:
                            'Could not add item to cart. Please check required options and try again.'
                    })
                )
            ]);
        }
    }

    

    const cartCallToActionText =
        !isEverythingOutOfStock || !isOutOfStock ? (
            <FormattedMessage
                id="productFullDetail.addItemToCart"
                defaultMessage="Add to cart"
            />
        ) : (
            <FormattedMessage
                id="productFullDetail.itemOutOfStock"
                defaultMessage="Out of Stock"
            />
        );
    // Error message for screen reader
    const cartActionContent = isSupportedProductType ? (
        <section className={classes.actButton}>
            <Button
                data-cy="ProductFullDetail-addToCartButton"
                disabled={isAddToCartDisabled}
                aria-disabled={isAddToCartDisabled}
                aria-label={
                    isEverythingOutOfStock
                        ? formatMessage({
                              id: 'productFullDetail.outOfStockProduct',
                              defaultMessage:
                                  'This item is currently out of stock'
                          })
                        : ''
                }
                priority="high"
                type="submit"
            >
                <Image src={addCartIcon} width={24} height={24} />
                {cartCallToActionText}
            </Button>
        </section>
    ) : (
        <div className={classes.unavailableContainer}>
            <Info />
            <p>
                <FormattedMessage
                    id={'productFullDetail.unavailableProduct'}
                    defaultMessage={
                        'This product is currently unavailable for purchase.'
                    }
                />
            </p>
        </div>
    );

    const shortDescription = productDetails.shortDescription ? (
        <RichContent html={productDetails.shortDescription.html} />
    ) : null;



   

    return (
        <Fragment>
            <div class={classes.pdpContainer}>
                {breadcrumbs}
                <Form
                    className={classes.root}
                    data-cy="ProductFullDetail-root"
                    onSubmit={handleAddToCart}
                >
                    <section className={classes.imageCarousel}>
                        <Carousel images={mediaGalleryEntries} />
                    </section>
                    <div className={classes.productFullInformationBlock}>
                        <section className={classes.title}>
                            <h1
                                aria-live="polite"
                                className={classes.productName}
                                data-cy="ProductFullDetail-productName"
                            >
                                <span>{product.sku} - </span>
                                <span>{productDetails.name}</span>
                            </h1>
                            <p
                                data-cy="ProductFullDetail-productPrice"
                                className={classes.productPrice}
                            >
                                MSRP :{' '}
                                <Price
                                    currencyCode={productDetails.price.currency}
                                    value={productDetails.price.value}
                                />
                            </p>
                            {shortDescription}
                        </section>
                        <FormError
                            classes={{
                                root: classes.formErrors
                            }}
                            errors={errors.get('form') || []}
                        />
                        <section className={classes.options}>{options}</section>

                        {isSignedIn &&
                            sizesTable &&
                            <div
                                            className="product-grid-table "
                                           
                                        >
                                            {/* Header row */}
                                            <ul>
                                                <li>
                                                    {productDetails.sku} -{' '}
                                                    {sizesTable?.color?.label}
                                                </li>
                                                <li>PRICE</li>
                                                <li>INVENTORY</li>
                                                <li>ORDER QUANTITY</li>
                                            </ul>

                                            {/* Product rows */}
                                            {sizesTable &&
                                                Object.entries(
                                                    sizesTable?.sizes || {}
                                                ).map(([size, details]) => (
                                                    <ul
                                                        className="space-y-4"
                                                        key={size}
                                                    >
                                                        <li className="border p-4 rounded-lg shadow-md">
                                                            {size}
                                                        </li>
                                                        <li className="border p-4 rounded-lg shadow-md">
                                                            {details.price}
                                                        </li>
                                                        <li className="border p-4 rounded-lg shadow-md">
                                                            {details.inventory}
                                                        </li>
                                                        <li className="border p-4 rounded-lg shadow-md">
                                                            <input
                                                                type="number"
                                                                min="0"
                                                                // value={quantities?.[details.sku] ?? 0}
                                                                onChange={e =>
                                                                    handleQuantityChange(
                                                                        details.sku,
                                                                        e.target
                                                                            .value
                                                                    )
                                                                }
                                                                className="w-16 p-1 border rounded"
                                                            />
                                                        </li>
                                                    </ul>
                                                ))}
                                        </div>
}

                       
                        <section className={classes.actions}>
                            {cartActionContent}
                            <Suspense fallback={null}>
                                <WishlistButton {...wishlistButtonProps} />
                            </Suspense>
                        </section>
                        <section className={classes.description}>
                        <span
                            data-cy="ProductFullDetail-descriptionTitle"
                            className={classes.descriptionTitle}
                        >
                            <FormattedMessage
                                id={'productFullDetail.description'}
                                defaultMessage={'Description'}
                            />
                        </span>
                        <RichContent html={productDetails.description} />
                    </section>
                    <section className={classes.details}>
                        <span
                            data-cy="ProductFullDetail-detailsTitle"
                            className={classes.detailsTitle}
                        >
                            <FormattedMessage
                                id={'productFullDetail.details'}
                                defaultMessage={'Details'}
                            />
                        </span>
                       
                    </section>
                    
                    </div>
                    
                   
                  
                </Form>
                 <section ><ComparableStyles isSignedIn={isSignedIn}/></section>
                      <section ><CompanionStyles isSignedIn={isSignedIn}/></section>
            </div>
        </Fragment>
    );
};

ProductFullDetail.propTypes = {
    classes: shape({
        cartActions: string,
        description: string,
        descriptionTitle: string,
        details: string,
        detailsPageBuilder: string,
        detailsPageBuilderList: string,
        detailsTitle: string,
        imageCarousel: string,
        options: string,
        productName: string,
        productPrice: string,
        quantity: string,
        quantityTitle: string,
        quantityRoot: string,
        root: string,
        title: string,
        unavailableContainer: string
    }),
    product: shape({
        __typename: string,
        id: number,
        stock_status: string,
        sku: string.isRequired,
        price: shape({
            regularPrice: shape({
                amount: shape({
                    currency: string.isRequired,
                    value: number.isRequired
                })
            }).isRequired
        }).isRequired,
        media_gallery_entries: arrayOf(
            shape({
                uid: string,
                label: string,
                position: number,
                disabled: bool,
                file: string.isRequired
            })
        ),
        description: string,
        short_description: shape({
            html: string,
            __typename: string
        })
    }).isRequired
};

export default ProductFullDetail;
