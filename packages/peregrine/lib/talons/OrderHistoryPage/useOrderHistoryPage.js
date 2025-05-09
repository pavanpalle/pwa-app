import { useCallback, useEffect, useMemo, useState } from 'react';
import { useLazyQuery, useQuery } from '@apollo/client';

import { useAppContext } from '@magento/peregrine/lib/context/app';
import { deriveErrorMessage } from '@magento/peregrine/lib/util/deriveErrorMessage';
import mergeOperations from '@magento/peregrine/lib/util/shallowMerge';

import DEFAULT_OPERATIONS from './orderHistoryPage.gql';

const PAGE_SIZE = 10;
const CURRENT_PAGE = 1;

export const useOrderHistoryPage = (props = {}) => {
    const operations = mergeOperations(DEFAULT_OPERATIONS, props.operations);
    const { getOrderPdfQuery, getSalesOrderListQuery } = operations;

    const [
        ,
        {
            actions: { setPageLoading }
        }
    ] = useAppContext();
 
    const [pageSize, setPageSize] = useState(PAGE_SIZE);
    const [currentPage, setCurrentPage] = useState(CURRENT_PAGE);
    const [searchText, setSearchText] = useState('');
   

    const {
        data: orderData,
        error: getOrderError,
        loading: orderLoading
    } = useQuery(getSalesOrderListQuery, {
        fetchPolicy: 'cache-and-network',
        variables: {
            filter: {
                
            },
            pageSize,
            currentPage
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

    const orders = orderData ? orderData.salesOrdersList.items : [];

    const isLoadingWithoutData = !orderData && orderLoading;
    const isBackgroundLoading = !!orderData && orderLoading;

    const pageInfo = useMemo(() => {
        if (orderData) {
            const { total_count } = orderData.salesOrdersList;

            return {
                current: pageSize < total_count ? pageSize : total_count,
                total: total_count
            };
        }

        return null;
    }, [orderData, pageSize]);

    const derivedErrorMessage = useMemo(
        () => deriveErrorMessage([getOrderError]),
        [getOrderError]
    );

    const handleReset = useCallback(() => {
        setSearchText('');
    }, []);

    const handleSubmit = useCallback(({ search }) => {
        setSearchText(search);
    }, []);

    const loadMoreOrders = useMemo(() => {
        // if (orderData) {
        //     const { page_info } = orderData.salesOrdersList.items;
        //     const { current_page, total_pages } = page_info;

        //     if (current_page < total_pages) {
        //         return () => setPageSize(current => current + PAGE_SIZE);
        //     }
        // }

        return null;
    }, []);

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
        handleReset,
        handleSubmit,
        isBackgroundLoading,
        isLoadingWithoutData,
        loadMoreOrders,
        orders,
        pageInfo,
        searchText,
        handleDownloadPdf
        
    };
};
