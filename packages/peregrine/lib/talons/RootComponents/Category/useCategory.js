import { useLazyQuery, useQuery } from '@apollo/client';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';

import { useAppContext } from '../../../context/app';
import { usePagination } from '../../../hooks/usePagination';
import { useSort } from '../../../hooks/useSort';
import {
    getFilterInput,
    getFiltersFromSearch
} from '../../../talons/FilterModal/helpers';
import mergeOperations from '../../../util/shallowMerge';

import DEFAULT_OPERATIONS from './category.gql';

/**
 * A [React Hook]{@link https://reactjs.org/docs/hooks-intro.html} that
 * controls the logic for the Category Root Component.
 *
 * @kind function
 *
 * @param {object}      props
 * @param {String}      props.id - Category uid.
 * @param {GraphQLAST}  props.operations.getCategoryQuery - Fetches category using a server query
 * @param {GraphQLAST}  props.operations.getFilterInputsQuery - Fetches "allowed" filters using a server query
 * @param {GraphQLAST}  props.queries.getStoreConfig - Fetches store configuration using a server query
 *
 * @returns {object}    result
 * @returns {object}    result.error - Indicates a network error occurred.
 * @returns {object}    result.categoryData - Category data.
 * @returns {bool}      result.isLoading - Category data loading.
 * @returns {string}    result.metaDescription - Category meta description.
 * @returns {object}    result.pageControl - Category pagination state.
 * @returns {array}     result.sortProps - Category sorting parameters.
 * @returns {number}    result.pageSize - Category total pages.
 */
export const useCategory = props => {
    const {
        id,
        queries: { getPageSize }
    } = props;

    const operations = mergeOperations(DEFAULT_OPERATIONS, props.operations);
    const { getCategoryQuery, getFilterInputsQuery } = operations;
const [lastLoadedPage, setLastLoadedPage] = useState(0);
    const { data: pageSizeData } = useQuery(getPageSize, {
        fetchPolicy: 'cache-and-network',
        nextFetchPolicy: 'cache-first'
    });
    const pageSize = pageSizeData && pageSizeData.storeConfig.grid_per_page;

    const [paginationValues, paginationApi] = usePagination();
    const { currentPage, totalPages } = paginationValues;
    const { setCurrentPage, setTotalPages } = paginationApi;

    const sortProps = useSort({ sortFromSearch: false });
    const [currentSort] = sortProps;

    // Keep track of the sort criteria so we can tell when they change.
    const previousSort = useRef(currentSort);

    const pageControl = {
        currentPage,
        setPage: setCurrentPage,
        totalPages
    };

    const [
        ,
        {
            actions: { setPageLoading }
        }
    ] = useAppContext();

    const [runQuery, queryResponse] = useLazyQuery(getCategoryQuery, {
        fetchPolicy: 'cache-and-network',
        nextFetchPolicy: 'cache-first'
    });
    const {
        called: categoryCalled,
        loading: categoryLoading,
        error,
        data,
        fetchMore
    } = queryResponse;
    const { search } = useLocation();

   

    const isBackgroundLoading = !!data && categoryLoading;

    // Update the page indicator if the GraphQL query is in flight.
    useEffect(() => {
        setPageLoading(isBackgroundLoading);
    }, [isBackgroundLoading, setPageLoading]);

    // Keep track of the search terms so we can tell when they change.
    const previousSearch = useRef(search);

    // Get "allowed" filters by intersection of schema and aggregations
    const {
        called: introspectionCalled,
        data: introspectionData,
        loading: introspectionLoading
    } = useQuery(getFilterInputsQuery);

    // Create a type map we can reference later to ensure we pass valid args
    // to the graphql query.
    // For example: { category_id: 'FilterEqualTypeInput', price: 'FilterRangeTypeInput' }
    const filterTypeMap = useMemo(() => {
        const typeMap = new Map();
        if (introspectionData) {
            introspectionData.__type.inputFields.forEach(({ name, type }) => {
                typeMap.set(name, type.name);
            });
        }
        return typeMap;
    }, [introspectionData]);

const handleLoadMore = useCallback(
    async (pageToFetch, id, newFilters, pageSize, currentSort) => {
        await fetchMore({
            variables: {
                currentPage: Number(pageToFetch),
                id: id,
                filters: newFilters,
                pageSize: Number(pageSize),
                sort: {
                    [currentSort.sortAttribute]: currentSort.sortDirection
                }
            },
            updateQuery: (previousResult, { fetchMoreResult }) => {
                if (!fetchMoreResult) return previousResult;
                return {
                    ...fetchMoreResult,
                    products: {
                        ...fetchMoreResult.products,
                        items: [
                            ...previousResult.products.items,
                            ...fetchMoreResult.products.items
                        ],
                        page_info: fetchMoreResult.products.page_info
                    }
                };
            }
        });
    },
    [fetchMore]
);

// Run the category query immediately and whenever its variable values change.

useEffect(() => {
   if (!filterTypeMap.size || !pageSize) {
        return;
    }
    const filters = getFiltersFromSearch(search);
    // Construct the filter arg object.
    const newFilters = {};
    filters.forEach((values, key) => {
        newFilters[key] = getFilterInput(values, filterTypeMap.get(key));
    });
    // Use the category uid for the current category page regardless of the
    // applied filters. Follow-up in PWA-404.
    newFilters['category_uid'] = { eq: id };

    const currentPageNum = Number(currentPage);
    const pageSizeNum = Number(pageSize);

    console.log('Variables:', {
        id,
        pageSize: pageSizeNum,
        currentPage: currentPageNum,
        newFilters,
        sort: currentSort
    });

   const loadData = async () => {
        // Initial load (no data loaded yet)
        if (lastLoadedPage === 0) {
            try {
                // For any initial page, load with adjusted page size
                const result = await runQuery({
                    variables: {
                        currentPage: 1,
                        id: id,
                        filters: newFilters,
                        pageSize: currentPageNum === 1 ? pageSizeNum : currentPageNum * pageSizeNum,
                        sort: {
                            [currentSort.sortAttribute]: currentSort.sortDirection
                        }
                    }
                });
                
                // Check if the requested page is valid based on total count
                const totalItems = result?.data?.products?.total_count || 0;
                const totalPages = Math.ceil(totalItems / pageSizeNum);
                
                // If current page is beyond the total pages, adjust it
                if (currentPageNum > totalPages && totalPages > 0) {
                    console.log(`Requested page ${currentPageNum} exceeds total pages ${totalPages}. Adjusting to last page.`);
                    // You might want to update UI state to show the last valid page
                    // setCurrentPage(totalPages); // Uncomment if you want to auto-adjust
                }
                
                setLastLoadedPage(Math.min(currentPageNum, totalPages));
            } catch (error) {
                console.error('Error loading products:', error);
            }
        }
        // When going back to an earlier page that we've already loaded data for
        else if (currentPageNum === 1 || currentPageNum < lastLoadedPage) {
            try {
                await runQuery({
                    variables: {
                        currentPage: 1,
                        id: id,
                        filters: newFilters,
                        pageSize: currentPageNum === 1 ? pageSizeNum : currentPageNum * pageSizeNum,
                        sort: {
                            [currentSort.sortAttribute]: currentSort.sortDirection
                        }
                    }
                });
                setLastLoadedPage(currentPageNum);
            } catch (error) {
                console.error('Error loading products:', error);
            }
        } 
        // If we're incrementing from a previously loaded page
        else if (currentPageNum > lastLoadedPage) {
            try {
                // Load just the next page with handleLoadMore
                await handleLoadMore(
                    currentPageNum, 
                    id, 
                    newFilters, 
                    pageSizeNum, 
                    currentSort
                );
                setLastLoadedPage(currentPageNum);
            } catch (error) {
                console.error('Error loading more products:', error);
                // If loading fails, don't update lastLoadedPage
            }
        }
    };

    loadData()
    
}, [currentSort, filterTypeMap, id, pageSize, runQuery, search, currentPage, fetchMore, handleLoadMore, lastLoadedPage]);
 

    const totalPagesFromData = data?.products?.total_count
    ? Math.ceil(data.products.total_count / pageSize)
    : null;

    useEffect(() => {
        setTotalPages(totalPagesFromData);
        return () => {
            setTotalPages(null);
        };
    }, [setTotalPages, totalPagesFromData]);

    // If we get an error after loading we should try to reset to page 1.
    // If we continue to have errors after that, render an error message.
    useEffect(() => {
        if (error && !categoryLoading && !data && currentPage !== 1) {
            setCurrentPage(1);
             setLastLoadedPage(0);
        }
    }, [currentPage, error, categoryLoading, setCurrentPage, data]);

    // Reset the current page back to one (1) when the search string, filters
    // or sort criteria change.
    useEffect(() => {
        // We don't want to compare page value.
        const prevSearch = new URLSearchParams(previousSearch.current);
        const nextSearch = new URLSearchParams(search);
        prevSearch.delete('page');
        nextSearch.delete('page');

        if (
            prevSearch.toString() !== nextSearch.toString() ||
            previousSort.current.sortAttribute.toString() !==
                currentSort.sortAttribute.toString() ||
            previousSort.current.sortDirection.toString() !==
                currentSort.sortDirection.toString()
        ) {
            // The search term changed.
            setCurrentPage(1, true);
             setLastLoadedPage(0);

            // And update the ref.
            previousSearch.current = search;
            previousSort.current = currentSort;
        }
    }, [currentSort, previousSearch, search, setCurrentPage]);

       const clonedData = data ? {
    ...data,
    products: {
        ...data.products,
        page_info: {
            ...data.products.page_info,
            current_page: currentPage,
            total_pages: totalPagesFromData
        }
    }
} : null;
    const categoryData = categoryLoading && !data ? null : clonedData;
    const categoryNotFound =
        !categoryLoading && data && data.categories.items.length === 0;
    const metaDescription =
        data &&
        data.categories.items[0] &&
        data.categories.items[0].meta_description
            ? data.categories.items[0].meta_description
            : '';

    // When only categoryLoading is involved, noProductsFound component flashes for a moment
    const loading =
        (introspectionCalled && !categoryCalled) ||
        (categoryLoading && !data) ||
        introspectionLoading;

    // useScrollTopOnChange(currentPage);




    return {
        error,
        categoryData,
        loading,
        metaDescription,
        pageControl,
        sortProps,
        pageSize,
        categoryNotFound,
        handleLoadMore
    };
};
