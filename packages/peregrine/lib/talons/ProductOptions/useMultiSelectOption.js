// src/peregrine/lib/talons/ProductOptions/useMultiSelectOption.js
import { useCallback, useMemo, useState, useEffect } from 'react';

export const useMultiSelectOption = props => {
    const {
        attribute_id,
        onSelectionChange,
        selectedValues = [],
        values,
        getProductDetailsByColor
    } = props;

    // State to track multiple selections
    const [selectedValueIndexes, setSelectedValueIndexes] = useState(
        selectedValues
    );

    useEffect(()=>{
         if (getProductDetailsByColor) {
           
            getProductDetailsByColor([values?.[0]?.value_index]);
        }
        if (onSelectionChange) {
            onSelectionChange(attribute_id, [values?.[0]?.value_index]);
        }
        setSelectedValueIndexes([values?.[0]?.value_index]);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[])

    // Update state when props change
    useEffect(() => {
        if (selectedValues && selectedValues.length > 0) {
            setSelectedValueIndexes(selectedValues);
        }
    }, [selectedValues]);

    // Create a map of value_index to store_label for easy lookups
    const valuesMap = useMemo(() => {
        return new Map(
            values.map(value => [value.value_index, value.store_label])
        );
    }, [values]);

    // Handle toggling a selection (add or remove)
    const handleSelectionToggle = useCallback(
        valueIndex => {
            const newSelections = [...selectedValueIndexes];
            const selectionIndex = newSelections.indexOf(valueIndex);

            if (selectionIndex === -1) {
                // Add the selection
                newSelections.push(valueIndex);
            } else {
                // Remove the selection
                newSelections.splice(selectionIndex, 1);
            }

            setSelectedValueIndexes(newSelections);
            //If this is a color swatch and we need to update product details
            if (getProductDetailsByColor) {
                // Use the most recently selected color
                if (newSelections.length > 0) {
                    getProductDetailsByColor(
                        newSelections
                    );
                } else {
                    getProductDetailsByColor([0]);
                }
            }

            if (onSelectionChange) {
                onSelectionChange(attribute_id, newSelections);
            }
        },
        [
            attribute_id,
            onSelectionChange,
            selectedValueIndexes,
            getProductDetailsByColor
        ]
    );

    // Check if a specific value is selected
    const isSelected = useCallback(
        valueIndex => {
            return selectedValueIndexes.includes(valueIndex);
        },
        [selectedValueIndexes]
    );

    // Clear all selections
    const clearSelections = useCallback(() => {
        setSelectedValueIndexes([]);
        if (onSelectionChange) {
            onSelectionChange(attribute_id, []);
            if (getProductDetailsByColor) {
                getProductDetailsByColor(null);
            }
        }
    }, [attribute_id, onSelectionChange, getProductDetailsByColor]);

    return {
        handleSelectionToggle,
        selectedValueIndexes,
        isSelected,
        clearSelections
    };
};
