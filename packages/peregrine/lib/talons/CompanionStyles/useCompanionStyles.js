import { useQuery } from '@apollo/client';
import { useMemo, useRef, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

import { useIntersectionObserver } from '@magento/peregrine/lib/hooks/useIntersectionObserver';
import mergeOperations from '../../util/shallowMerge';
import DEFAULT_OPERATIONS from './crosssellProducts.gql';
import { useUserContext } from '@magento/peregrine/lib/context/user';
export const useCompanionStyles = (props = {}) => {
    const [{ isSignedIn }] = useUserContext();
    const operations = mergeOperations(DEFAULT_OPERATIONS, props.operations);
    const {
        getStoreConfigData,
        getCompanionProductsQuery,
        getCompanionProductsWithoutPriceQuery
    } = operations;
    const { pathname } = useLocation();
    const productsQuery = isSignedIn
        ? getCompanionProductsQuery
        : getCompanionProductsWithoutPriceQuery;
    const itemRef = useRef(null);
    const hasFetchedRef = useRef(false); // ✅ Ensure query triggers only once
    const [shouldFetch, setShouldFetch] = useState(false);

    const intersectionObserver = useIntersectionObserver();

    // Observe the element and trigger data fetching once
    useEffect(() => {
        const el = itemRef.current;
        if (!intersectionObserver || !el || hasFetchedRef.current) return;

        const onIntersect = ([entry]) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    observer.unobserve(el);
                    hasFetchedRef.current = true;
                    setShouldFetch(true);
                }, 500);
            }
        };

        const observer = new intersectionObserver(onIntersect, {
            threshold: 0.9
        });

        observer.observe(el);

        return () => observer.unobserve(el);
    }, [intersectionObserver]);

    const { data: storeConfigData } = useQuery(getStoreConfigData, {
        fetchPolicy: 'cache-and-network',
        nextFetchPolicy: 'cache-first',
        skip: !shouldFetch
    });

    const slug = pathname.split('/').pop();
    const productUrlSuffix = storeConfigData?.storeConfig?.product_url_suffix;
    const urlKey = productUrlSuffix ? slug.replace(productUrlSuffix, '') : slug;

    const { error, loading, data } = useQuery(productsQuery, {
        fetchPolicy: 'cache-and-network',
        nextFetchPolicy: 'cache-first',
        skip: !storeConfigData || !shouldFetch,
        variables: { urlKey }
    });

    const product = useMemo(() => {
        if (!data) {
            // The product isn't in the cache and we don't have a response from GraphQL yet.
            return null;
        }

        // Note: if a product is out of stock _and_ the backend specifies not to
        // display OOS items, the items array will be empty.

        // Only return the product that we queried for.
        const product = data.products.items.find(
            item => item.url_key === urlKey
        );

        if (!product) {
            return null;
        }

        return product?.crosssell_products || [];
    }, [data, urlKey]);
    return {
        error,
        loading,
        product,
        storeConfigData,
        itemRef // 👈 Attach this to the element you want to observe
    };
};
