import { shape, string } from 'prop-types';
import React, { useEffect, useMemo } from 'react';
import {
    AlertCircle as AlertCircleIcon
} from 'react-feather';
import { FormattedMessage, useIntl } from 'react-intl';

import { useToasts } from '@magento/peregrine/lib/Toasts';
import OrderHistoryContextProvider from '@magento/peregrine/lib/talons/OrderHistoryPage/orderHistoryContext';
import { useOrderHistoryPage } from '@magento/peregrine/lib/talons/OrderHistoryPage/useOrderHistoryPage';

import { useStyle } from '../../classify';
import { StoreTitle } from '../Head';
import Icon from '../Icon';
import LoadingIndicator from '../LoadingIndicator';

import defaultClasses from './orderHistoryPage.module.css';

import AccountMenuItems from '../AccountMenu/accountMenuItems';
import JQGrid from '../JQGrid';
const errorIcon = (
    <Icon
        src={AlertCircleIcon}
        attrs={{
            width: 18
        }}
    />
);


const OrderHistoryPage = props => {
    const talonProps = useOrderHistoryPage();
    const {
        errorMessage,
        isBackgroundLoading,
        isLoadingWithoutData,
        orders,
        searchText,
        handleDownloadPdf
    } = talonProps;
    const [, { addToast }] = useToasts();
    const { formatMessage } = useIntl();
    const PAGE_TITLE = formatMessage({
        id: 'orderHistoryPage.pageTitleText',
        defaultMessage: 'Order History'
    });
   

    const ordersCountMessage = formatMessage(
        {
            id: 'orderHistoryPage.ordersCount',
            defaultMessage: 'You have {count} orders in your history.'
        },
        { count: orders.length }
    );

    const classes = useStyle(defaultClasses, props.classes);



    const pageContents = useMemo(() => {
        if (isLoadingWithoutData) {
            return <LoadingIndicator />;
        } else if (!isBackgroundLoading && searchText && !orders.length) {
            return (
                <h3 className={classes.emptyHistoryMessage}>
                    <FormattedMessage
                        id={'orderHistoryPage.invalidOrderNumber'}
                        defaultMessage={`Order "${searchText}" was not found.`}
                        values={{
                            number: searchText
                        }}
                    />
                </h3>
            );
        } else if (!isBackgroundLoading && !orders.length) {
            return (
                <h3 className={classes.emptyHistoryMessage}>
                    <FormattedMessage
                        id={'orderHistoryPage.emptyDataMessage'}
                        defaultMessage={"You don't have any orders yet."}
                    />
                </h3>
            );
        } else {
            return (
                <ul
                    className={classes.orderHistoryTable}
                    data-cy="OrderHistoryPage-orderHistoryTable"
                >
                    <JQGrid data={orders} handleDownloadPdf={handleDownloadPdf}/>
                    {/* {orderRows} */}
                </ul>
            );
        }
    }, [
        classes.emptyHistoryMessage,
        classes.orderHistoryTable,
        isBackgroundLoading,
        isLoadingWithoutData,
        orders,
        searchText,
        handleDownloadPdf
    ]);

   

    // const loadMoreButton = loadMoreOrders ? (
    //     <Button
    //         classes={{ root_lowPriority: classes.loadMoreButton }}
    //         disabled={isBackgroundLoading || isLoadingWithoutData}
    //         onClick={loadMoreOrders}
    //         priority="low"
    //     >
    //         <FormattedMessage
    //             id={'orderHistoryPage.loadMore'}
    //             defaultMessage={'Load More'}
    //         />
    //     </Button>
    // ) : null;

    useEffect(() => {
        if (errorMessage) {
            addToast({
                type: 'error',
                icon: errorIcon,
                message: errorMessage,
                dismissable: true,
                timeout: 10000
            });
        }
    }, [addToast, errorMessage]);

    return (
        <div className="account-layout">
            <AccountMenuItems />
            <OrderHistoryContextProvider>
                <div className={classes.root}>
                    <StoreTitle>{PAGE_TITLE}</StoreTitle>
                    <div aria-live="polite" className={classes.heading}>
                        {PAGE_TITLE}
                        <div
                            aria-live="polite"
                            aria-label={ordersCountMessage}
                        />
                    </div>

                  
                    {pageContents}

                   
                </div>
            </OrderHistoryContextProvider>
        </div>
    );
};

export default OrderHistoryPage;

OrderHistoryPage.propTypes = {
    classes: shape({
        root: string,
        heading: string,
        emptyHistoryMessage: string,
        orderHistoryTable: string,
        search: string,
        searchButton: string,
        submitIcon: string,
        loadMoreButton: string
    })
};
