import { useLazyQuery, useQuery } from '@apollo/client';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useAppContext } from '@magento/peregrine/lib/context/app';
import { deriveErrorMessage } from '@magento/peregrine/lib/util/deriveErrorMessage';
import mergeOperations from '@magento/peregrine/lib/util/shallowMerge';
import DEFAULT_OPERATIONS from './orderDetailPage.gql';
import { useHistory } from 'react-router-dom';

export const useOrderDetailPage = (props = {}) => {
    const { orderId } = props;
    const history = useHistory();
    const operations = mergeOperations(DEFAULT_OPERATIONS, props.operations);
    const {getOrderPdfQuery, getSalesOrderListQuery } = operations;
    const [
        ,
        {
            actions: { setPageLoading }
        }
    ] = useAppContext();

     const [isOpen, setIsOpen] = useState(false);
    
       

    const {
        data: orderData,
        error: getOrderError,
        loading: orderLoading
    } = useQuery(getSalesOrderListQuery, {
        fetchPolicy: 'cache-and-network',
        variables: {
            OrderNo: orderId
        }
    });

    const [
                getPdfDetails,
                { data: orderPdfData }
            ] = useLazyQuery(getOrderPdfQuery, {
                // We use this query to fetch details _just_ before submission, so we
                // want to make sure it is fresh. We also don't want to cache this data
                // because it may contain PII.
                fetchPolicy: 'no-cache'
            });

    const orderDetailData = orderData ? orderData.salesOrderDetail[0] : {};
    const isLoadingWithoutData = !orderData && orderLoading;
    const isBackgroundLoading = !!orderData && orderLoading;
    const derivedErrorMessage = useMemo(
        () => deriveErrorMessage([getOrderError]),
        [getOrderError]
    );

 
    const handleBackNavigation = useCallback(() => {
        history.goBack();
    }, [history]);


    const handleDownloadPdf = useCallback(async (orderId) => {
        await getPdfDetails({
            variables: {
                OrderNo: orderId
            }
        });
    }, [getPdfDetails]);

    const downloadBase64AsPDF = (base64String, filename = 'file.pdf') => {
        // Remove the data URL prefix if present
        const base64 = base64String.replace(/^data:application\/pdf;base64,/, '');
      
        // Convert Base64 to binary
        const byteCharacters = atob(base64);
        const byteNumbers = new Array(byteCharacters.length).fill(0).map((_, i) => byteCharacters.charCodeAt(i));
        const byteArray = new Uint8Array(byteNumbers);
      
        // Create a Blob with PDF type
        const blob = new Blob([byteArray], { type: 'application/pdf' });
      
        // Create a download link and trigger it
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = filename;
        document.body.appendChild(link);
        link.click();
      
        // Cleanup
        document.body.removeChild(link);
        URL.revokeObjectURL(link.href);
      };

      const handleContentToggle = useCallback(() => {
        setIsOpen(currentValue => !currentValue);
    }, []);

         // Update the page indicator if the GraphQL query is in flight.
    useEffect(() => {
        setPageLoading(isBackgroundLoading);
    }, [isBackgroundLoading, setPageLoading]);


      useEffect(() => {
        if (orderPdfData) {
          
            downloadBase64AsPDF(orderPdfData?.orderPdf.pdfData, 'order.pdf');
        }
    }, [orderPdfData]);
    return {
        errorMessage: derivedErrorMessage,
        isBackgroundLoading,
        isLoadingWithoutData,
        orderDetailData,
        handleBackNavigation,
        handleDownloadPdf,
        handleContentToggle,
        isOpen
    };
};
