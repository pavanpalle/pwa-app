import React from 'react';
import { useStyle } from '@magento/venia-ui/lib/classify';
import { useMultiSelectOption } from '@magento/peregrine/lib/talons/ProductOptions/useMultiSelectOption'; 
import Button from '@magento/venia-ui/lib/components/Button';
import defaultClasses from './multiSelectSwatch.module.css'; 


const getClassName = (
    name,
    isSelected,
    hasFocus,
    isOptionOutOfStock,
    isEverythingOutOfStock
) =>
    `${name}${isSelected ? '_selected' : ''}${hasFocus ? '_focused' : ''}${
        isEverythingOutOfStock || isOptionOutOfStock ? '_outOfStock' : ''
    }`;

// Swatches _must_ have a 1x1 aspect ratio to match the UI.
const SWATCH_WIDTH = 48;

const MultiSelectSwatch = props => {
    const {
        attribute_id,
        attribute_code,
        label,
        values,
        style,
        onSelectionChange,
        selectedValues = [],
        isOptionOutOfStock,
        hasFocus,
        isEverythingOutOfStock,
        outOfStockVariants,
        getProductDetailsByColor,
        from
    } = props;

    

    const talonProps = useMultiSelectOption({
        attribute_id,
        onSelectionChange,
        selectedValues,
        values,
        getProductDetailsByColor
    });

    const {
        handleSelectionToggle,
        selectedValueIndexes,
        isSelected,
        clearSelections
    } = talonProps;

    const classes = useStyle(defaultClasses, props.classes);
    
    // Check if this is a color swatch
    const isColorSwatch = attribute_code === 'color' || label.toLowerCase() === 'color';
    
    const swatchItems = values.map(item => {
        const { value_index, store_label, swatch_data } = item;
        const selected = isSelected(value_index);
        
        // Check if this variant is out of stock
        const isOutOfStock = outOfStockVariants && 
            outOfStockVariants[attribute_id] && 
            outOfStockVariants[attribute_id].includes(value_index);


            const className =
        classes[
            getClassName(
                'root',
                isSelected,
                hasFocus,
                isOptionOutOfStock,
                isEverythingOutOfStock
            )
        ];
        
        const swatchClass = selected
            ? classes.swatchItemSelected
            : isOutOfStock
                ? classes.swatchItemOutOfStock
                : classes.swatchItem;
        
        // Create style for the swatch based on the swatch_data
        // let swatchStyle = {};
        // if (swatch_data) {
        //     if (swatch_data.type === '1') { // Color swatch
        //         swatchStyle.backgroundColor = swatch_data.value;
        //     } else if (swatch_data.type === '2') { // Image swatch
        //         swatchStyle.backgroundImage = `url("${swatch_data.value}")`;
        //         swatchStyle.backgroundSize = 'cover';
        //         swatchStyle.backgroundPosition = 'center';
        //     } else if (swatch_data.type === '0') { // Text swatch
        //         // Use default styles
        //     }
        // }

         let finalStyle = style;
        
            if (swatch_data) {
                const { thumbnail, value } = swatch_data;
        
                let swatchValue = '';
        
                if (thumbnail) {
                    const imagePath = generateUrl(thumbnail, 'image-swatch')(
                        SWATCH_WIDTH
                    );
        
                    swatchValue = `url("${imagePath}")`;
                } else {
                    swatchValue = value;
                }
        
                // We really want to avoid specifying presentation within JS.
                // Swatches are unusual in that their color is data, not presentation,
                // but applying color *is* presentational.
                // So we merely provide the color data here, and let the CSS decide
                // how to use that color (e.g., background, border).
                finalStyle = Object.assign({}, style, {
                    '--venia-swatch-bg': swatchValue
                });
            }
        
        const handleClick = () => {
            if (!isOutOfStock || from === 'productPage') {
                handleSelectionToggle(value_index);
            }
        };
        
        return (
            <div
                key={value_index}
                className={className}
                style={finalStyle}
                onClick={handleClick}
                onKeyDown={e => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        handleClick();
                    }
                }}
                role="button"
                tabIndex="0"
                aria-label={`${store_label} ${selected ? 'selected' : 'not selected'} ${isOutOfStock ? 'out of stock' : ''}`}
            >
                <div 
                    className={isColorSwatch ? classes.colorSwatch : classes.textSwatch} 
                    //style={swatchStyle}
                >
                    {selected && <span className={classes.checkmark}>✓</span>}
                </div>
                <span className={classes.swatchLabel}>{store_label}</span>
                {isOutOfStock && <span className={classes.outOfStockLabel}>Out of Stock</span>}
            </div>
        );
    });
    
    // Get descriptive labels for all selected values
    const selectedLabels = selectedValueIndexes.map(index => {
        const value = values.find(v => v.value_index === index);
        return value ? value.store_label : '';
    }).filter(Boolean).join(', ');
    
    return (
        <div className={classes.root}>
            <div className={classes.title}>
                <span>{label}</span>
                {selectedValueIndexes.length > 0 && (
                    <Button
                        onClick={clearSelections}
                        priority="low"
                        type="button"
                        className={classes.clearButton}
                    >
                        Clear
                    </Button>
                )}
            </div>
            
            <div className={classes.swatchList}>{swatchItems}</div>
            
            {selectedValueIndexes.length > 0 && (
                <div className={classes.selectedInfo}>
                    <span className={classes.selectedCount}>
                        {selectedValueIndexes.length} selected:
                    </span>
                    <span className={classes.selectedLabels}>
                        {selectedLabels}
                    </span>
                </div>
            )}
        </div>
    );
};

export default MultiSelectSwatch;