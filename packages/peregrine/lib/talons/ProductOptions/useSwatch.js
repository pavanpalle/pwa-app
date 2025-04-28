import { useCallback, useEffect } from 'react';

export const useSwatch = props => {
    const { onClick, value_index, getProductDetailsByColor, items } = props;

    
    useEffect(() => {
        if (getProductDetailsByColor) {
            getProductDetailsByColor([items?.[0]?.value_index]);
        }

        onClick(items?.[0]?.value_index);

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [items]);

    const handleClick = useCallback(() => {
        onClick(value_index);
        if (getProductDetailsByColor) {
            getProductDetailsByColor(value_index);
        }
    }, [value_index, onClick, getProductDetailsByColor]);

    return {
        handleClick
    };
};
