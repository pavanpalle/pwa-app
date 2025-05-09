import React, { useEffect } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { Check } from 'react-feather';
import { useCartPage } from '@magento/peregrine/lib/talons/CartPage/useCartPage';
import { useStyle } from '@magento/venia-ui/lib/classify';
import { useToasts } from '@magento/peregrine';

import Icon from '../Icon';
import { StoreTitle } from '../Head';
import { fullPageLoadingIndicator } from '../LoadingIndicator';
import StockStatusMessage from '../StockStatusMessage';
import PriceAdjustments from './PriceAdjustments';
import PriceSummary from './PriceSummary';
import ProductListing from './ProductListing';
import defaultClasses from './cartPage.module.css';
import angleRightIcon from './angle-arrow-right.svg';
import timesIcon from './times-icon.svg';
import Image from '../Image';

const CheckIcon = <Icon size={20} src={Check} />;

/**
 * Structural page component for the shopping cart.
 * This is the main component used in the `/cart` route in Venia.
 * It uses child components to render the different pieces of the cart page.
 *
 * @see {@link https://venia.magento.com/cart}
 *
 * @param {Object} props
 * @param {Object} props.classes CSS className overrides for the component.
 * See [cartPage.module.css]{@link https://github.com/magento/pwa-studio/blob/develop/packages/venia-ui/lib/components/CartPage/cartPage.module.css}
 * for a list of classes you can override.
 *
 * @returns {React.Element}
 *
 * @example <caption>Importing into your project</caption>
 * import CartPage from "@magento/venia-ui/lib/components/CartPage";
 */
const CartPage = props => {
    
    const talonProps = useCartPage();

    const {
        cartItems,
        hasItems,
        isCartUpdating,
        fetchCartDetails,
        onAddToWishlistSuccess,
        setIsCartUpdating,
        shouldShowLoadingIndicator,
        wishlistSuccessProps
    } = talonProps;

    const classes = useStyle(defaultClasses, props.classes);
    const { formatMessage } = useIntl();
    const [, { addToast }] = useToasts();

    useEffect(() => {
        if (wishlistSuccessProps) {
            addToast({ ...wishlistSuccessProps, icon: CheckIcon });
        }
    }, [addToast, wishlistSuccessProps]);

    if (shouldShowLoadingIndicator) {
        return fullPageLoadingIndicator;
    }

    const productListing = hasItems ? (
        <ProductListing
            onAddToWishlistSuccess={onAddToWishlistSuccess}
            setIsCartUpdating={setIsCartUpdating}
            fetchCartDetails={fetchCartDetails}
        />
    ) : (
        <div>
            <div>
                <h3>
                    <div>
                        <FormattedMessage
                            id={'cartPage.emptyCart'}
                            defaultMessage={'There are no items in your cart.'}
                        />
                    </div>
                </h3>
            </div>
        </div>
    );

    const priceAdjustments = hasItems ? (
        <PriceAdjustments setIsCartUpdating={setIsCartUpdating} />
    ) : null;

    const priceSummary = hasItems ? (
        <PriceSummary isUpdating={isCartUpdating} />
    ) : null;

    return (
        <div className='cart-container'>
            <div className={classes.heading_container}>
                    <h1
                        aria-live="polite"
                        data-cy="CartPage-heading"
                        className={classes.heading}
                    >
                        <FormattedMessage
                            id={'cartPage.heading'}
                            defaultMessage={'Shopping Cart'}
                        />
                    </h1>
                    <div className={classes.stockStatusMessageContainer}>
                        <StockStatusMessage cartItems={cartItems} />
                    </div>
                </div>
        <div className='cart-inner'>
            <div className={classes.root} data-cy="CartPage-root">
                <StoreTitle>
                    {formatMessage({
                        id: 'cartPage.title',
                        defaultMessage: 'Shopping Cart'
                    })}
                </StoreTitle>
                
                <div className={classes.body}>
                    <div className={classes.items_container}>{productListing}</div>
                    <div className={classes.price_adjustments_container}>
                        {priceAdjustments}
                    </div>
                    <div className={classes.summary_container}>
                        <button type="button" className='cart-button'>Update Shopping Cart <Image src={angleRightIcon} width={8} height={16} /></button>
                        <button type="button" className='cart-button'><Image src={timesIcon} width={24} height={24} /> Clear Cart</button>
                        <div className={classes.summary_contents}>
                            {priceSummary}
                        </div>
                    </div>
                </div>
            </div>
        </div>
        </div>

    );
};

export default CartPage;
