import React from 'react';
import { array, func } from 'prop-types';

import Option from './option';
import { useOptions } from '@magento/peregrine/lib/talons/ProductOptions/useOptions';

const Options = props => {
    const {
        classes,
        onSelectionChange,
        options,
        selectedValues = [],
        isEverythingOutOfStock,
        outOfStockVariants,
        from = 'productPage'
    } = props;

    const talonProps = useOptions({
        onSelectionChange,
        selectedValues,
        options
    });

    const { handleSelectionChange, selectedValueMap } = talonProps;

    return options
        ? options
              .filter(option => {
                  // Only apply filtering logic when from is "home" or "list"
                  if (from === 'Gallery Item' || from === 'list') {
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
              .map(option => (
                  <Option
                      {...option}
                      classes={classes}
                      key={option.attribute_id}
                      onSelectionChange={handleSelectionChange}
                      selectedValue={selectedValueMap.get(option.label)}
                      isEverythingOutOfStock={isEverythingOutOfStock}
                      outOfStockVariants={outOfStockVariants}
                      from={from}
                  />
              ))
        : null;

    // Render a list of options passing in any pre-selected values.
    // return options
    //     ? options?.map(option => (
    //           <Option
    //               {...option}
    //               classes={classes}
    //               key={option.attribute_id}
    //               onSelectionChange={handleSelectionChange}
    //               selectedValue={selectedValueMap.get(option.label)}
    //               isEverythingOutOfStock={isEverythingOutOfStock}
    //               outOfStockVariants={outOfStockVariants}
    //               from={from}
    //           />
    //       ))
    //     : null;
};

Options.propTypes = {
    onSelectionChange: func,
    options: array.isRequired,
    selectedValues: array
};

export default Options;
