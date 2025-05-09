import { useEffect, useState, useMemo } from 'react';
import { useLazyQuery, useQuery } from '@apollo/client';

import mergeOperations from '../../../util/shallowMerge';
import { useEventingContext } from '../../../context/eventing';

import DEFAULT_OPERATIONS from './categoryContent.gql';

/**
 * Returns props necessary to render the categoryContent component.
 *
 * @param {object} props.data - The results of a getCategory GraphQL query.
 *
 * @returns {object} result
 * @returns {string} result.categoryDescription - This category's description.
 * @returns {string} result.categoryName - This category's name.
 * @returns {object} result.filters - The filters object.
 * @returns {object} result.items - The items in this category.
 * @returns {number} result.totalPagesFromData - The total amount of pages for the query.
 */
export const useCategoryContent = props => {
    const { categoryId, data, pageSize = 6 } = props;

    const operations = mergeOperations(DEFAULT_OPERATIONS, props.operations);

    const {
        getCategoryContentQuery,
        getProductFiltersByCategoryQuery,
        getCategoryAvailableSortMethodsQuery
    } = operations;

    const [
        getFiltersAttributeCode,
        { data: filterAttributeData }
    ] = useLazyQuery(getProductFiltersByCategoryQuery, {
        fetchPolicy: 'cache-and-network',
        nextFetchPolicy: 'cache-first'
    });

    useEffect(() => {
        if (categoryId) {
            getFiltersAttributeCode({
                variables: {
                    filters: {
                        category_uid: { eq: categoryId }
                    }
                }
            });
        }
    }, [categoryId, getFiltersAttributeCode]);

    const availableFilterData = filterAttributeData
        ? filterAttributeData.products?.aggregations
        : null;
    const availableFilters = availableFilterData
        ?.map(eachitem => eachitem.attribute_code)
        ?.sort();

    const handlePriceFilter = priceFilter => {
        if (priceFilter && priceFilter.size > 0) {
            for (const price of priceFilter) {
                const [from, to] = price.value.split('_');
                return { price: { from, to } };
            }
        }
        return {};
    };

    const [filterOptions, setFilterOptions] = useState();

    const selectedFilters = useMemo(() => {
        const filters = {};
        if (filterOptions) {
            for (const [group, items] of filterOptions.entries()) {
                availableFilters?.map(eachitem => {
                    if (eachitem === group && group !== 'price') {
                        const sampleArray = [];
                        for (const item of items) {
                            sampleArray.push(item.value);
                        }
                        filters[group] = sampleArray;
                    }
                });
            }
        }

        if (filterOptions && filterOptions.has('price')) {
            const priceFilter = filterOptions.get('price');
            const priceRange = handlePriceFilter(priceFilter);
            if (priceRange.price) {
                filters.price = priceRange.price;
            }
        }

        return filters;
    }, [filterOptions, availableFilters]);

    const dynamicQueryVariables = useMemo(() => {
        const generateDynamicFiltersQuery = filterParams => {
            let filterConditions = {
                category_uid: { eq: categoryId }
            };

            Object.keys(filterParams).forEach(key => {
                let filter = {};
                if (key !== 'price') {
                    filter = { [key]: { in: filterParams[key] } };
                }
                filterConditions = { ...filterConditions, ...filter };
            });

            return filterConditions;
        };

        return generateDynamicFiltersQuery(selectedFilters);
    }, [selectedFilters, categoryId]);

    const placeholderItems = Array.from({ length: pageSize }).fill(null);

    const [getFilters, { data: filterData }] = useLazyQuery(
        getProductFiltersByCategoryQuery,
        {
            fetchPolicy: 'cache-and-network',
            nextFetchPolicy: 'cache-first'
        }
    );

    const [getSortMethods, { data: sortData }] = useLazyQuery(
        getCategoryAvailableSortMethodsQuery,
        {
            fetchPolicy: 'cache-and-network',
            nextFetchPolicy: 'cache-first'
        }
    );

    const { data: categoryData, loading: categoryLoading } = useQuery(
        getCategoryContentQuery,
        {
            fetchPolicy: 'cache-and-network',
            nextFetchPolicy: 'cache-first',
            skip: !categoryId,
            variables: {
                id: categoryId
            }
        }
    );

    const [, { dispatch }] = useEventingContext();
    const [previousFilters, setPreviousFilters] = useState(null);
    useEffect(() => {
        if (
            categoryId &&
            JSON.stringify(selectedFilters) !== JSON.stringify(previousFilters)
        ) {
            getFilters({
                variables: {
                    filters: dynamicQueryVariables
                }
            });
            setPreviousFilters(selectedFilters);
        }
    }, [
        categoryId,
        selectedFilters,
        dynamicQueryVariables,
        previousFilters,
        getFilters
    ]);

    useEffect(() => {
        if (categoryId) {
            getSortMethods({
                variables: {
                    categoryIdFilter: {
                        in: categoryId
                    }
                }
            });
        }
    }, [categoryId, getSortMethods]);

    const filters = filterData ? filterData.products?.aggregations : null;
    const items = data ? data.products.items : placeholderItems;
    const totalPagesFromData = data
        ? data.products.page_info.total_pages
        : null;
    const totalCount = data ? data.products.total_count : null;
    const categoryName =
        categoryData && categoryData.categories.items.length
            ? categoryData.categories.items[0].name
            : null;
    const categoryDescription =
        categoryData && categoryData.categories.items.length
            ? categoryData.categories.items[0].description
            : null;
    const availableSortMethods = sortData
        ? sortData?.products?.sort_fields?.options
        : null;

    useEffect(() => {
        if (!categoryLoading && categoryData?.categories.items.length > 0) {
            dispatch({
                type: 'CATEGORY_PAGE_VIEW',
                payload: {
                    id: categoryData.categories.items[0].uid,
                    name: categoryData.categories.items[0].name,
                    url_key: categoryData.categories.items[0].url_key,
                    url_path: categoryData.categories.items[0].url_path
                }
            });
        }
    }, [categoryData, dispatch, categoryLoading]);

    return {
        availableSortMethods,
        categoryName,
        categoryDescription,
        filters,
        filterOptions,
        setFilterOptions,
        items,
        totalCount,
        totalPagesFromData
    };
};
