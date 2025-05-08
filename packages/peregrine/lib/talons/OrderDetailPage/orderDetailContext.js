import React, { createContext, useContext, useMemo } from 'react';
import { useQuery } from '@apollo/client';

import mergeOperations from '@magento/peregrine/lib/util/shallowMerge';
import DEFAULT_OPERATIONS from './orderDetailContext.gql';

const OrderDetailContext = createContext();

const OrderDetailContextProvider = props => {
    const operations = mergeOperations(DEFAULT_OPERATIONS, props.operations);
    const { getProductURLSuffixQuery } = operations;

    const { data } = useQuery(getProductURLSuffixQuery, {
        fetchPolicy: 'cache-and-network'
    });

    const storeConfig = useMemo(() => {
        return {
            productURLSuffix: data ? data.storeConfig.product_url_suffix : ''
        };
    }, [data]);

    return (
        <OrderDetailContext.Provider value={storeConfig}>
            {props.children}
        </OrderDetailContext.Provider>
    );
};

export default OrderDetailContextProvider;

export const useOrderDetailContext = () => useContext(OrderDetailContext);
