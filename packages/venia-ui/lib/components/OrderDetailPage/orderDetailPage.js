import React, { useMemo, useEffect } from 'react';
import { useIntl, FormattedMessage } from 'react-intl';
import {
    AlertCircle as AlertCircleIcon,
    ArrowLeft as BackArrow
} from 'react-feather';
import { shape, string } from 'prop-types';

import { useToasts } from '@magento/peregrine/lib/Toasts';
import OrderDetailContextProvider from '@magento/peregrine/lib/talons/OrderDetailPage/orderDetailContext';
import { useOrderDetailPage } from '@magento/peregrine/lib/talons/OrderDetailPage/useOrderDetailPage';

import { useStyle } from '../../classify';

import Icon from '../Icon';
import LoadingIndicator from '../LoadingIndicator';
import { StoreTitle } from '../Head';
import { useParams } from 'react-router-dom';

import defaultClasses from './orderDetailPage.module.css';

import AccountMenuItems from '../AccountMenu/accountMenuItems';
import OrderDetails from './OrderDetails';
const errorIcon = (
    <Icon
        src={AlertCircleIcon}
        attrs={{
            width: 18
        }}
    />
);

const BackIcon = (
    <Icon
        src={BackArrow}
        attrs={{
            width: 18
        }}
    />
);

const OrderDetailPage = props => {
    const { orderId } = useParams();
    const talonProps = useOrderDetailPage({ orderId });
    const {
        errorMessage,
        isLoadingWithoutData,
        orderDetailData,
        handleBackNavigation,
        handleDownloadPdf,
        handleContentToggle,
        isOpen
    } = talonProps;
    const [, { addToast }] = useToasts();
    const { formatMessage } = useIntl();
    const PAGE_TITLE = formatMessage({
        id: 'orderDetailPage.pageTitleText',
        defaultMessage: 'Open Sales Orders'
    });

    const classes = useStyle(defaultClasses, props.classes);

    const orderData = useMemo(() => {
        return (
            <OrderDetails
                orderData={orderDetailData}
                handleDownloadPdf={handleDownloadPdf}
                handleContentToggle={handleContentToggle}
                isOpen={isOpen}
       
            />
        );
    }, [orderDetailData, handleDownloadPdf, handleContentToggle, isOpen]);

    const pageContents = useMemo(() => {
        if (isLoadingWithoutData) {
            return <LoadingIndicator />;
        } else {
            return (
                <div
                    className={classes.orderHistoryTable}
                    data-cy="OrderHistoryPage-orderDetail"
                >
                    {orderData}
                </div>
            );
        }
    }, [classes.orderHistoryTable, isLoadingWithoutData, orderData]);

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
            <OrderDetailContextProvider>
                <div className={classes.root}>
                    <StoreTitle>{PAGE_TITLE}</StoreTitle>
                    <div aria-live="polite" className={classes.heading}>
                        {PAGE_TITLE}
                    </div>
                    <div>
                        <button
                            //className={classes.contentToggleContainer}
                            onClick={handleBackNavigation}
                            type="button"
                        >
                            {BackIcon}
                        </button>
                        <FormattedMessage
                            id="orderDetails.orderDetailLabel"
                            defaultMessage={'Order Details'}
                        />
                    </div>
                    <div>
                        <FormattedMessage
                            id="orderDetails.orderLabel"
                            defaultMessage={'orderID '}
                        />
                        <FormattedMessage
                            id="orderDetails.orderNumber"
                            defaultMessage={`#${orderId}`}
                        />
                    </div>

                    {pageContents}
                </div>
            </OrderDetailContextProvider>
        </div>
    );
};

export default OrderDetailPage;

OrderDetailPage.propTypes = {
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
