import { useCallback } from 'react';

export const useSwatch = props => {
    const { onClick, value_index ,getProductDetailsByColor} = props;

    const handleClick = useCallback(() => {
        onClick(value_index);
        getProductDetailsByColor(value_index);
    }, [value_index, onClick,getProductDetailsByColor]);

    return {
        handleClick
    };
};
