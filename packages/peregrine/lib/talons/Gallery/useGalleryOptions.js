import { useCallback, useMemo, useState } from 'react';

import { isProductConfigurable } from '../../util/isProductConfigurable';
import { getOutOfStockVariants } from '@magento/peregrine/lib/util/getOutOfStockVariants';
import { findMatchingVariant } from '@magento/peregrine/lib/util/findMatchingProductVariant';
const INITIAL_OPTION_CODES = new Map();
const INITIAL_OPTION_SELECTIONS = new Map();
const OUT_OF_STOCK_CODE = 'OUT_OF_STOCK';
const IN_STOCK_CODE = 'IN_STOCK';

const deriveOptionCodesFromProduct = product => {
    // If this is a simple product it has no option codes.
    if (!isProductConfigurable(product)) {
        return INITIAL_OPTION_CODES;
    }

    // Initialize optionCodes based on the options of the product.
    const initialOptionCodes = new Map();
    if (product?.configurable_options) {
    for (const {
        attribute_id,
        attribute_code
    } of product.configurable_options) {
        initialOptionCodes.set(attribute_id, attribute_code);
    }
}

    return initialOptionCodes;
};

// Similar to deriving the initial codes for each option.
const deriveOptionSelectionsFromProduct = product => {
    if (!isProductConfigurable(product)) {
        return INITIAL_OPTION_SELECTIONS;
    }

    const initialOptionSelections = new Map();
    if (product?.configurable_options) {
        for (const { attribute_id } of product?.configurable_options) {
            initialOptionSelections.set(attribute_id, undefined);
        }
    }

    return initialOptionSelections;
};

const getIsAllOutOfStock = product => {
    const { stock_status, variants } = product;
    const isConfigurable = isProductConfigurable(product);

    if (isConfigurable) {
        const inStockItem = variants.find(item => {
            return item.product.stock_status === IN_STOCK_CODE;
        });
        return !inStockItem;
    }

    return stock_status === OUT_OF_STOCK_CODE;
};

const getMediaGalleryEntries = (product, optionCodes, optionSelections) => {
    let value = [];

    const { media_gallery_entries, variants } = product;
    const isConfigurable = isProductConfigurable(product);

    // Selections are initialized to "code => undefined". Once we select a value, like color, the selections change. This filters out unselected options.
    const optionsSelected =
        Array.from(optionSelections.values()).filter(value => !!value).length >
        0;

    if (!isConfigurable || !optionsSelected) {
        value = media_gallery_entries;
    } else {
        // If any of the possible variants matches the selection add that
        // variant's image to the media gallery. NOTE: This _can_, and does,
        // include variants such as size. If Magento is configured to display
        // an image for a size attribute, it will render that image.
        const item = findMatchingVariant({
            optionCodes,
            optionSelections,
            variants
        });

        value = item
            ? [...item.product.media_gallery_entries, ...media_gallery_entries]
            : media_gallery_entries;
    }

    return value;
};

const normalizeSize = (label) => {
  const map = {
    "EXTRASMALL": "XS",
    "SMALL": "S",
    "MEDIUM": "M",
    "LARGE": "L",
    "EXTRALARGE": "XL",
  };
  const cleanLabel = label.replace(/[\s\-]/g, '').toUpperCase();
  return map[cleanLabel] || cleanLabel;
};

const getSizeScore = (size) => {
  if (/^X+S$/.test(size)) return -size.match(/^X+/)[0].length;
  if (/^X+L$/.test(size)) return size.match(/^X+/)[0].length + 2;
  const base = { XS: -1, S: 0, M: 1, L: 2, XL: 3 };
  return base[size] !== undefined ? base[size] : 100;
};

const useSizeRange = (configurableOptions) => {


   


  return useMemo(() => {
    const sizeOption = configurableOptions.find(opt => opt.attribute_code === 'size');
    if (!sizeOption) return null;

    const normalizedSizes = sizeOption.values
      .map(v => normalizeSize(v.label))
      .filter((val, idx, self) => self.indexOf(val) === idx);

    const sortedSizes = normalizedSizes.sort((a, b) => getSizeScore(a) - getSizeScore(b));

    return `${sortedSizes[0]} - ${sortedSizes[sortedSizes.length - 1]}`;
  }, [configurableOptions]);
};

export const useGalleryOptions = props => {
    const { product } = props;

    const derivedOptionSelections = useMemo(
        () => deriveOptionSelectionsFromProduct(product),
        [product]
    );

    const [optionSelections, setOptionSelections] = useState(
        derivedOptionSelections
    );

    const derivedOptionCodes = useMemo(
        () => deriveOptionCodesFromProduct(product),
        [product]
    );
    const [optionCodes] = useState(derivedOptionCodes);

    // Check if display out of stock products option is selected in the Admin Dashboard
    const isOutOfStockProductDisplayed = useMemo(() => {
        let totalVariants = 1;
        const isConfigurable = isProductConfigurable(product);
        if (product.configurable_options && isConfigurable) {
            for (const option of product.configurable_options) {
                const length = option.values.length;
                totalVariants = totalVariants * length;
            }
            return product.variants.length === totalVariants;
        }
    }, [product]);

    const [singleOptionSelection, setSingleOptionSelection] = useState();

    const isEverythingOutOfStock = useMemo(() => getIsAllOutOfStock(product), [
        product
    ]);

    const mediaGalleryEntries = useMemo(
        () => getMediaGalleryEntries(product, optionCodes, optionSelections),
        [product, optionCodes, optionSelections]
    );

    const outOfStockVariants = useMemo(
        () =>
            getOutOfStockVariants(
                product,
                optionCodes,
                singleOptionSelection,
                optionSelections,
                isOutOfStockProductDisplayed
            ),
        [
            product,
            optionCodes,
            singleOptionSelection,
            optionSelections,
            isOutOfStockProductDisplayed
        ]
    );

    const handleSelectionChange = useCallback(
        (optionId, selection) => {
            // We must create a new Map here so that React knows that the value
            // of optionSelections has changed.
            const nextOptionSelections = new Map([...optionSelections]);
            nextOptionSelections.set(optionId, selection);
            setOptionSelections(nextOptionSelections);
            // Create a new Map to keep track of single selections with key as String
            const nextSingleOptionSelection = new Map();
            nextSingleOptionSelection.set(optionId, selection);
            setSingleOptionSelection(nextSingleOptionSelection);
        },
        [optionSelections]
    );


    const sizeRange = useSizeRange(product.configurable_options||[]);

    return {
        isEverythingOutOfStock,
        outOfStockVariants,
        handleSelectionChange,
        mediaGalleryEntries,
        sizeRange
    };
};
