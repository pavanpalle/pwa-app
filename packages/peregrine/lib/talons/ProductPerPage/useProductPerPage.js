import { useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';

// Define available page size options
export const PAGE_SIZE_OPTIONS = [
    { value: '24', label: '24' },
    { value: '36', label: '36' },
    { value: '48', label: '48' }
];

export const DEFAULT_PAGE_SIZE = '24';

export const useProductPerPage = (props) => {
    const { total_count,pageSize, setPageSize } = props;

    const history = useHistory();
    const location = useLocation();

    const urlParams = new URLSearchParams(location.search);
    const urlPageSize = urlParams.get('product_list_limit') || DEFAULT_PAGE_SIZE;

   // const [pageSize, setPageSize] = useState(urlPageSize);

    // 🆕 Dynamically build initialValues based on current URL
    const initialValues = {
        product_list_limit: urlPageSize
    };

    // Sync state with URL on mount/location change
    useEffect(() => {
        const updatedUrlParams = new URLSearchParams(location.search);
        const newPageSize = updatedUrlParams.get('product_list_limit') || DEFAULT_PAGE_SIZE;

        if (pageSize !== newPageSize) {
            setPageSize(newPageSize);
        }
    }, [location.search, pageSize]);

    const setProductsPerPage = (newSize) => {
        if (newSize === pageSize) return;

        const updatedUrlParams = new URLSearchParams(location.search);

        if (newSize === DEFAULT_PAGE_SIZE) {
            updatedUrlParams.delete('product_list_limit');
        } else {
            updatedUrlParams.set('product_list_limit', newSize);
        }

        if (updatedUrlParams.has('page')) {
            updatedUrlParams.set('page', 1);
        }

        history.push({
            pathname: location.pathname,
            search: updatedUrlParams.toString()
        });

        setPageSize(newSize);
    };

    const handleSubmit = (values) => {
        if (values.products_per_page) {
            setProductsPerPage(values.products_per_page);
        }
    };

    const handleSelectionChange = (selectedValue) => {
        setProductsPerPage(selectedValue);
    };

    return {
        pageSize,
        initialValues,
        options: PAGE_SIZE_OPTIONS,
        handleSubmit,
        handleSelectionChange
    };
};
