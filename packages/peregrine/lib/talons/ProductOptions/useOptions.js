import { useCallback } from 'react';

export const useOptions = props => {
    const { onSelectionChange, selectedValues, options ,getProductDetailsByColor} = props;


    const handleSelectionChange = useCallback(
        (optionId, selection) => {
            if (onSelectionChange) {
                onSelectionChange(optionId, selection);
            }
        },
        [onSelectionChange]
    );

    const selectedValueMap = new Map();

    // Map the option with correct option_label
    for (const { id, value_label } of selectedValues) {
        const option_label = options.find(
            option => option.attribute_id === String(id)
        ).label;
        selectedValueMap.set(option_label, value_label);
    }

    const multiSelectedValueMap = new Map();

    for (const { id, value_id } of selectedValues) {
            const option = options.find(option => option.attribute_id === String(id));
            
            if (option) {
                const currentValues = multiSelectedValueMap.get(option.label) || [];
                if (!currentValues.includes(value_id)) {
                    multiSelectedValueMap.set(option.label, [...currentValues, value_id]);
                }
            }
        
    }

    const handleMultiSelectionChange = useCallback(
        (optionId, values) => {
            // Find the option by its ID
            const option = options.find(opt => opt.attribute_id === optionId);
            
            if (!option) {
                return;
            }
            
            // If this is a color swatch and we need to update product details
            // if (getProductDetailsByColor ) {
            //     // Use the most recently selected color
            //     if(values.length > 0){
            //         console.log("values", values);
            //     getProductDetailsByColor(values[values.length - 1]);
            //     }else{
            //         console.log("values ELSE", values);
            //         getProductDetailsByColor(null);
            //     }
            // }
            
            // Call the parent onSelectionChange with all selections
            if (onSelectionChange) {
                // For multi-select, we need to call the provided callback with the full selection data
                onSelectionChange(optionId, values);
            }
        },
        [getProductDetailsByColor, onSelectionChange, options]
    );


    


    return {
        handleSelectionChange,
        selectedValueMap,
        handleMultiSelectionChange,
        multiSelectedValueMap
    };
};
