import React from 'react';
import { array, func } from 'prop-types';
import Option from './option';
import MultiSelectSwatch from './MultiSelectSwatch';
import { useOptions } from '@magento/peregrine/lib/talons/ProductOptions/useOptions';

const Options = props => {
    const {
        classes,
        onSelectionChange,
        options,
        selectedValues = [],
        isEverythingOutOfStock,
        outOfStockVariants,
        from = 'productPage',
        getProductDetailsByColor
    } = props;

    const talonProps = useOptions({
        onSelectionChange,
        selectedValues,
        options,
        getProductDetailsByColor
    });

    const { handleSelectionChange, selectedValueMap, handleMultiSelectionChange, multiSelectedValueMap } = talonProps;

    return options
        ? options
              .filter(option => {
                  // Only apply filtering logic when from is "home" or "list"
                  if (from === 'Gallery Item' || from === 'productPage') {
                      // Check if both color and size options exist
                      const hasColor = options.some(
                          opt => opt.label?.toLowerCase() === 'color'
                      );
                      const hasSize = options.some(
                          opt => opt.label?.toLowerCase() === 'size'
                      );
                      // If both exist, only render color options
                      if (hasColor && hasSize) {
                          return option.label?.toLowerCase() === 'color';
                      }
                  }
                  // Otherwise render all options
                  return true;
              })
              .map(option => {
                  // Check if this is a multi-select attribute
                  // You need to define which attributes are multi-select
                  // This could be based on attribute code, input_type, or a custom flag
                  const isMultiSelect = option.attribute_code === 'color' ;
                  
                  if (isMultiSelect) {
                      return (
                          <MultiSelectSwatch
                              {...option}
                              classes={classes}
                              key={option.attribute_id}
                              onSelectionChange={handleMultiSelectionChange}
                              selectedValues={multiSelectedValueMap?.get(option.label) || []}
                              isEverythingOutOfStock={isEverythingOutOfStock}
                              outOfStockVariants={outOfStockVariants}
                              getProductDetailsByColor={option.label?.toLowerCase() === 'color' ? getProductDetailsByColor : undefined}
                              from={from}
                          />
                      );
                  }
                  
                  // Use the existing Option component for regular single-select options
                  return (
                      <Option
                          {...option}
                          classes={classes}
                          key={option.attribute_id}
                          onSelectionChange={handleSelectionChange}
                          selectedValue={selectedValueMap.get(option.label)}
                          isEverythingOutOfStock={isEverythingOutOfStock}
                          outOfStockVariants={outOfStockVariants}
                          getProductDetailsByColor={getProductDetailsByColor}
                          from={from}
                      />
                  );
              })
        : null;
};

Options.propTypes = {
    onSelectionChange: func,
    options: array.isRequired,
    selectedValues: array
};

export default Options;
