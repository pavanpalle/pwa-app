import { useEffect, useMemo } from 'react';
import { useHistory, useLocation } from 'react-router-dom';

export const DEFAULT_PAGE_SIZE = '24';

export const useProductPerPage = (props) => {
    const { total_count, pageSize, setPageSize } = props;

    const history = useHistory();
    const location = useLocation();

    const urlParams = new URLSearchParams(location.search);
    const urlPageSize = urlParams.get('product_list_limit') || DEFAULT_PAGE_SIZE;

    const initialValues = {
        product_list_limit: urlPageSize
    };

    useEffect(() => {
        const updatedUrlParams = new URLSearchParams(location.search);
        const newPageSize = updatedUrlParams.get('product_list_limit') || DEFAULT_PAGE_SIZE;

        if (pageSize !== newPageSize) {
            setPageSize(newPageSize);
        }
    }, [location.search, pageSize, setPageSize]);

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

    // 🔁 Dynamically generate options
    const options = useMemo(() => [
        { value: '24', label: '24' },
        { value: '36', label: '36' },
        { value: '48', label: '48' },
        { value: String(total_count), label: 'View All' }
    ], [total_count]);

    return {
        pageSize,
        initialValues,
        options,
        handleSubmit,
        handleSelectionChange
    };
};
