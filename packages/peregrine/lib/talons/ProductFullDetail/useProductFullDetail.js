import { useCallback, useState, useMemo, useEffect } from 'react';
import { useIntl } from 'react-intl';
import { useMutation, useQuery } from '@apollo/client';
import { useCartContext } from '@magento/peregrine/lib/context/cart';
import { useUserContext } from '@magento/peregrine/lib/context/user';

import { appendOptionsToPayload } from '@magento/peregrine/lib/util/appendOptionsToPayload';
import { findMatchingVariant } from '@magento/peregrine/lib/util/findMatchingProductVariant';
import { isProductConfigurable } from '@magento/peregrine/lib/util/isProductConfigurable';
import { isSupportedProductType as isSupported } from '@magento/peregrine/lib/util/isSupportedProductType';
import { deriveErrorMessage } from '../../util/deriveErrorMessage';
import mergeOperations from '../../util/shallowMerge';
import defaultOperations from './productFullDetail.gql';
import { useEventingContext } from '../../context/eventing';
import { getOutOfStockVariants } from '@magento/peregrine/lib/util/getOutOfStockVariants';

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
    for (const {
        attribute_id,
        attribute_code
    } of product.configurable_options) {
        initialOptionCodes.set(attribute_id, attribute_code);
    }

    return initialOptionCodes;
};

// Similar to deriving the initial codes for each option.
const deriveOptionSelectionsFromProduct = product => {
    if (!isProductConfigurable(product)) {
        return INITIAL_OPTION_SELECTIONS;
    }

    const initialOptionSelections = new Map();
    for (const { attribute_id } of product.configurable_options) {
        initialOptionSelections.set(attribute_id, undefined);
    }

    return initialOptionSelections;
};

const getIsMissingOptions = (product, optionSelections) => {
    // Non-configurable products can't be missing options.
    if (!isProductConfigurable(product)) {
        return false;
    }

    // Configurable products are missing options if we have fewer
    // option selections than the product has options.
    const { configurable_options } = product;
    const numProductOptions = configurable_options.length;
    const numProductSelections = Array.from(optionSelections.values()).filter(
        value => !!value
    ).length;

    return numProductSelections < numProductOptions;
};

const getIsOutOfStock = (product, optionCodes, optionSelections) => {
    const { stock_status, variants } = product;
    const isConfigurable = isProductConfigurable(product);
    const optionsSelected =
        Array.from(optionSelections.values()).filter(value => !!value).length >
        0;

    if (isConfigurable && optionsSelected) {
        const item = findMatchingVariant({
            optionCodes,
            optionSelections,
            variants
        });
        const stockStatus = item?.product?.stock_status;

        return stockStatus === OUT_OF_STOCK_CODE || !stockStatus;
    }
    return stock_status === OUT_OF_STOCK_CODE;
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

    const uniqueEntriesMap = new Map();
    value.forEach(entry => {
        const key = entry.file || entry.id?.toString() || JSON.stringify(entry);
        if (!uniqueEntriesMap.has(key)) {
            uniqueEntriesMap.set(key, entry);
        }
    });

    return Array.from(uniqueEntriesMap.values());

    //return value;
};

// const getMediaGalleryEntries = (product, optionCodes, optionSelections) => {
//     const { media_gallery_entries, variants } = product;
//     const isConfigurable = isProductConfigurable(product);
    
//     // Check if any options are selected (array values or single values)
//     const optionsSelected = Array.from(optionSelections.entries())
//         .some(([_, value]) => Array.isArray(value) ? value.length > 0 : !!value);
    
//     if (!isConfigurable || !optionsSelected) {
//         return media_gallery_entries;
//     } 
    
//     // Handle multiple variant selections
//     let matchingItems = [];
    
//     // Find all matching variants
//     if (variants && variants.length > 0) {
//         matchingItems = variants.filter(variant => 
//             variantMatchesSelections(variant, optionCodes, optionSelections)
//         );
//     }
    
//     if (matchingItems.length === 0) {
//         return media_gallery_entries;
//     }
    
//     // Collect media gallery entries from all matching variants
//     const variantMedia = matchingItems.flatMap(item => 
//         item.product?.media_gallery_entries || []
//     );
    
//     // Combine variant media with product media and remove duplicates
//     // Using a Set with a custom key to identify duplicate entries
//     const uniqueEntries = new Map();
    
//     // First add variant media (takes precedence)
//     variantMedia?.forEach(entry => {
//         // Create a unique key based on file or id (whichever is available)
//         const key = entry.file || entry.id?.toString();
//         if (key && !uniqueEntries.has(key)) {
//             uniqueEntries.set(key, entry);
//         }
//     });
    
//     // Then add product media if not already added
//     media_gallery_entries?.forEach(entry => {
//         const key = entry.file || entry.id?.toString();
//         if (key && !uniqueEntries.has(key)) {
//             uniqueEntries.set(key, entry);
//         }
//     });
    
//     return Array.from(uniqueEntries.values());
// };

// Helper function to check if a variant matches the selected options
// const variantMatchesSelections = (variant, optionCodes, optionSelections) => {
//     return Array.from(optionSelections.entries()).every(([optionId, selectedValues]) => {
//         // Skip unselected options
//         if (!selectedValues) return true;
        
//         const attributeCode = optionCodes.get(optionId);
//         if (!attributeCode) return true;
        
//         const matchingAttribute = variant.attributes.find(
//             attr => attr.code === attributeCode
//         );
        
//         if (!matchingAttribute) return false;
        
//         if (Array.isArray(selectedValues)) {
//             return selectedValues.includes(matchingAttribute.value_index);
//         } else {
//             return matchingAttribute.value_index === selectedValues;
//         }
//     });
// };

// We only want to display breadcrumbs for one category on a PDP even if a
// product has multiple related categories. This function filters and selects
// one category id for that purpose.
const getBreadcrumbCategoryId = categories => {
    // Exit if there are no categories for this product.
    if (!categories || !categories.length) {
        return;
    }
    const breadcrumbSet = new Set();
    categories?.forEach(({ breadcrumbs }) => {
        // breadcrumbs can be `null`...
        (breadcrumbs || []).forEach(({ category_uid }) =>
            breadcrumbSet.add(category_uid)
        );
    });

    // Until we can get the single canonical breadcrumb path to a product we
    // will just return the first category id of the potential leaf categories.
    const leafCategory = categories.find(
        category => !breadcrumbSet.has(category.uid)
    );

    // If we couldn't find a leaf category then just use the first category
    // in the list for this product.
    return leafCategory.uid || categories[0].uid;
};

const getConfigPrice = (product, optionCodes, optionSelections) => {
    let value;

    const { variants } = product;
    const isConfigurable = isProductConfigurable(product);

    const optionsSelected =
        Array.from(optionSelections.values()).filter(value => !!value).length >
        0;

    if (!isConfigurable || !optionsSelected) {
        value = product.price_range?.maximum_price;
    } else {
        const item = findMatchingVariant({
            optionCodes,
            optionSelections,
            variants
        });

        value = item
            ? item.product.price_range?.maximum_price
            : product.price_range?.maximum_price;
    }

    return value;
};

const attributeLabelCompare = (attribute1, attribute2) => {
    // const label1 = attribute1['attribute_metadata']['label'].toLowerCase();
    // const label2 = attribute2['attribute_metadata']['label'].toLowerCase();
    // if (label1 < label2) return -1;
    // else if (label1 > label2) return 1;
    // else return 0;
    return -1;
};

const getCustomAttributes = (product, optionCodes, optionSelections) => {
    const { custom_attributes, variants } = product;
    const isConfigurable = isProductConfigurable(product);
    const optionsSelected =
        Array.from(optionSelections.values()).filter(value => !!value).length >
        0;

    if (isConfigurable && optionsSelected) {
        const item = findMatchingVariant({
            optionCodes,
            optionSelections,
            variants
        });

        return item && item.product
        ? [...item.product.custom_attributesV2?.items].sort(attributeLabelCompare)
        : [];
    }

    return custom_attributes
        ? [...custom_attributes].sort(attributeLabelCompare)
        : [];
};




/**
 * Creates variables for the AddProductToCart GraphQL mutation
 * @param {string} cartId - The cart ID of the shopper
 * @param {Object} sizesTable - Table containing color and size options data
 * @param {Object} quantities - Object mapping SKUs to their quantities
 * @returns {Object} Variables object for the GraphQL mutation
 */
// function createCartVariables(cartId, sizesTable, quantities,parent_sku,productUid,productName) {
//     // Array to hold all cart items
//     const cartItems = [];
    
//     // Process each SKU in the quantities object
//     Object.entries(quantities)?.forEach(([sku, quantity]) => {
//       // Extract the size and color information from the SKU (WJ10-SIZE-COLOR format)
//       const skuParts = sku.split('-');
//       if (skuParts.length !== 3) {
//         console.error(`Invalid SKU format: ${sku}`);
//         return;
//       }
      
     
//       const size = skuParts[1];
//       const color = skuParts[2];
      
//       // Find matching color in sizesTable
//       let colorUid = null;
//       let sizeUid = null;
      
//       for (const [colorId, colorData] of Object.entries(sizesTable)) {
//         if (colorData.color.label === color) {
//           colorUid = colorData.color.uid;
          
//           // Find the matching size for this color
//           if (colorData.sizes[size]) {
//             sizeUid = colorData.sizes[size].size.uid;
//             break;
//           }
//         }
//       }
      
//       if (!colorUid || !sizeUid) {
//         console.error(`Could not find matching color (${color}) and size (${size}) for SKU: ${sku}`);
//         return;
//       }
      
//       // Create cart item
//       cartItems.push({
//         sku: sku,
//         parent_sku: parent_sku,
//         quantity: quantity,
//         entered_options: [
//           {
//             uid: productUid,
//             value: productName
//           }
//         ],
//         selected_options: [
//           colorUid,
//           sizeUid
//         ]
//       });
//     });
    
//     // Return the variables object
//     return {
//       cartId: cartId,
//       product: cartItems
//     };
//   }
  
  // Example usage:
  // const variables = createCartVariables(
  //   "3BKFyNXAlmKMRNw8xaMWhNPZKLh6eVqY", 
  //   sizesTable, 
  //   { "WJ10-XS-Black": 10, "WJ10-M-Black": 20, "WJ10-XL-Black": 30, "WJ10-S-Orange": 40, "WJ10-L-Orange": 50 }
  // );


  function createCartVariables(cartId, sizesTable, quantities, parent_sku, productUid, productName) {
    const cartItems = [];
  
    const colorLabel = sizesTable.color.label;
    const colorUid = sizesTable.color.uid;
  
    Object.entries(quantities)?.forEach(([sku, quantity]) => {
      const skuParts = sku.split('-');
      if (skuParts.length !== 3) {
        console.error(`Invalid SKU format: ${sku}`);
        return;
      }
  
      const size = skuParts[1];
      const color = skuParts[2];
  
      // Validate color (optional)
      if (color.toLowerCase() !== colorLabel.toLowerCase()) {
        console.error(`Color mismatch: SKU has ${color}, but table has ${colorLabel}`);
        return;
      }
  
      const sizeData = sizesTable.sizes[size];
      if (!sizeData) {
        console.error(`Size ${size} not found in sizesTable`);
        return;
      }
  
      cartItems.push({
        sku: sku,
        parent_sku: parent_sku,
        quantity: quantity,
        entered_options: [
          {
            uid: productUid,
            value: productName
          }
        ],
        selected_options: [
          colorUid,
          sizeData.size_index
        ]
      });
    });
  
    return {
      cartId: cartId,
      product: cartItems
    };
  }
  
/**
 * @param {GraphQLDocument} props.addConfigurableProductToCartMutation - configurable product mutation
 * @param {GraphQLDocument} props.addSimpleProductToCartMutation - configurable product mutation
 * @param {Object.<string, GraphQLDocument>} props.operations - collection of operation overrides merged into defaults
 * @param {Object} props.product - the product, see RootComponents/Product
 *
 * @returns {{
 *  breadcrumbCategoryId: string|undefined,
 *  errorMessage: string|undefined,
 *  handleAddToCart: func,
 *  handleSelectionChange: func,
 *  handleSetQuantity: func,
 *  isAddToCartDisabled: boolean,
 *  isSupportedProductType: boolean,
 *  mediaGalleryEntries: array,
 *  productDetails: object,
 *  quantity: number
 * }}
 */
export const useProductFullDetail = props => {
    const {
        addConfigurableProductToCartMutation,
        addSimpleProductToCartMutation,
        product
    } = props;

    const [, { dispatch }] = useEventingContext();

    const hasDeprecatedOperationProp = !!(
        addConfigurableProductToCartMutation || addSimpleProductToCartMutation
    );

    const operations = mergeOperations(defaultOperations, props.operations);

    const productType = product.__typename;

    const isSupportedProductType = isSupported(productType);

    const [{ cartId }] = useCartContext();
    const [{ isSignedIn }] = useUserContext();
    const { formatMessage } = useIntl();

    const { data: storeConfigData } = useQuery(
        operations.getWishlistConfigQuery,
        {
            fetchPolicy: 'cache-and-network'
        }
    );

    const [
        addConfigurableProductToCart,
        {
            error: errorAddingConfigurableProduct,
            loading: isAddConfigurableLoading
        }
    ] = useMutation(
        addConfigurableProductToCartMutation ||
            operations.addConfigurableProductToCartMutation
    );

    const [
        addSimpleProductToCart,
        { error: errorAddingSimpleProduct, loading: isAddSimpleLoading }
    ] = useMutation(
        addSimpleProductToCartMutation ||
            operations.addSimpleProductToCartMutation
    );

    const [
        addProductToCart,
        {
            data: addToCartResponseData,
            error: errorAddingProductToCart,
            loading: isAddProductLoading
        }
    ] = useMutation(operations.addProductToCartMutation);

    const breadcrumbCategoryId = useMemo(
        () => getBreadcrumbCategoryId(product.categories),
        [product.categories]
    );

    const derivedOptionSelections = useMemo(
        () => deriveOptionSelectionsFromProduct(product),
        [product]
    );

    const [optionSelections, setOptionSelections] = useState(
        derivedOptionSelections
    );

    const [singleOptionSelection, setSingleOptionSelection] = useState();

    const [sizesTable, setSizesTable] = useState();
      const [quantities, setQuantities] = useState({});

    const derivedOptionCodes = useMemo(
        () => deriveOptionCodesFromProduct(product),
        [product]
    );
    const [optionCodes] = useState(derivedOptionCodes);

    const isMissingOptions = useMemo(
        () => getIsMissingOptions(product, optionSelections),
        [product, optionSelections]
    );

    const isOutOfStock = useMemo(
        () => getIsOutOfStock(product, optionCodes, optionSelections),
        [product, optionCodes, optionSelections]
    );


     

   

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

    const isEverythingOutOfStock = useMemo(() => getIsAllOutOfStock(product), [
        product
    ]);

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

    const mediaGalleryEntries = useMemo(
        () => getMediaGalleryEntries(product, optionCodes, optionSelections),
        [product, optionCodes, optionSelections]
    );

    const customAttributes = useMemo(
        () => getCustomAttributes(product, optionCodes, optionSelections),
        [product, optionCodes, optionSelections]
    );

    const productPrice = useMemo(
        () => getConfigPrice(product, optionCodes, optionSelections),
        [product, optionCodes, optionSelections]
    );

    // The map of ids to values (and their uids)
    // For example:
    // { "179" => [{ uid: "abc", value_index: 1 }, { uid: "def", value_index: 2 }]}
    const attributeIdToValuesMap = useMemo(() => {
        const map = new Map();
        // For simple items, this will be an empty map.
        const options = product.configurable_options || [];
        for (const { attribute_id, values } of options) {
            map.set(attribute_id, values);
        }
        return map;
    }, [product.configurable_options]);

    // An array of selected option uids. Useful for passing to mutations.
    // For example:
    // ["abc", "def"]
    const selectedOptionsArray = useMemo(() => {
        const selectedOptions = [];

        console.log("optionSelections",optionSelections)

        optionSelections?.forEach((value, key) => {
           
            const values = attributeIdToValuesMap.get(key);

            

            const selectedValue = values?.find(
                item => item.value_index === Array.isArray(value)? value[0] : value
            );
          
            if (selectedValue) {
                selectedOptions.push(selectedValue.uid);
            }
        });
        return selectedOptions;
    }, [attributeIdToValuesMap, optionSelections]);






    const handleAddToCart = useCallback(
        async formValues => {
            const { quantity } = formValues;


            console.log("formVallues", formValues);

            /*
                @deprecated in favor of general addProductsToCart mutation. Will support until the next MAJOR.
             */
            if (hasDeprecatedOperationProp) {
                const payload = {
                    item: product,
                    productType,
                    quantity
                };

                if (isProductConfigurable(product)) {
                    appendOptionsToPayload(
                        payload,
                        optionSelections,
                        optionCodes
                    );
                }

              
                if (isSupportedProductType) {

                  
                    const variables = {
                        cartId,
                        parentSku: payload.parentSku,
                        product: payload.item,
                        quantity: payload.quantity,
                        sku: payload.item.sku
                    };
                    // Use the proper mutation for the type.
                    if (productType === 'SimpleProduct') {
                        try {
                            await addSimpleProductToCart({
                                variables
                            });
                        } catch {
                            return;
                        }
                    } else if (productType === 'ConfigurableProduct') {
                        try {
                            await addConfigurableProductToCart({
                                variables
                            });
                        } catch {
                            return;
                        }
                    }
                } else {
                    console.error(
                        'Unsupported product type. Cannot add to cart.'
                    );
                }
            } else {
                // const variables = {
                //     cartId,
                //     product: {
                //         sku: product.sku,
                //         quantity
                //     },
                //     entered_options: [
                //         {
                //             uid: product.uid,
                //             value: product.name
                //         }
                //     ]
                // };

                const variables = createCartVariables(cartId, sizesTable, quantities,product.sku,product.uid,product.name);

               
             

                // if (selectedOptionsArray.length) {
                //     variables.product.selected_options = selectedOptionsArray;
                // }
               
                try {
                    await addProductToCart({ variables });
                    console.log("selectedOptionsArray",selectedOptionsArray);
                    const selectedOptionsLabels =
                        selectedOptionsArray?.map((uid, i) => ({
                            attribute: product.configurable_options[i].label,
                            value:
                                product.configurable_options[i].values.findLast(
                                    x => x.uid === uid
                                )?.label || null
                        })) || null;
                    console.log("selectedOptionsLabels",selectedOptionsLabels);
                    dispatch({
                        type: 'CART_ADD_ITEM',
                        payload: {
                            cartId,
                            sku: product.sku,
                            name: product.name,
                            pricing: product.price,
                            priceTotal: productPrice.final_price.value,
                            currencyCode: productPrice.final_price.currency,
                            discountAmount: productPrice.discount.amount_off,
                            selectedOptions: [
                                {
                                    "attribute": "Color",
                                    "value": "Black"
                                },{
                                    "attribute": "Size",
                                    "value": "XL"
                                }
                            ],
                            quantity
                        }
                    });
                } catch {
                    return;
                }
            }
        },
        [addConfigurableProductToCart, addProductToCart, addSimpleProductToCart, cartId, dispatch, hasDeprecatedOperationProp, isSupportedProductType, optionCodes, optionSelections, product, productPrice.discount.amount_off, productPrice.final_price.currency, productPrice.final_price.value, productType, quantities, selectedOptionsArray, sizesTable]
    );

    const handleSelectionChange = useCallback(
        (optionId, selection) => {

            console.log("optionId,selection", optionId,selection);
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

    // const handleSelectionChange = useCallback(
    //     (optionId, selection) => {
        
          
    //       // Create a new Map for React state updates
    //       const nextOptionSelections = new Map([...optionSelections]);
    //       const existingSelection = nextOptionSelections.get(optionId) || [];
          
    //       // If selection is empty or null, clear the selection
    //       if (selection === null || (Array.isArray(selection) && selection.length === 0)) {
    //         nextOptionSelections.set(optionId, []);
    //       } 
    //       // If we're given a specific selection array, use it directly (replacing the existing one)
    //       else if (Array.isArray(selection)) {
    //         nextOptionSelections.set(optionId, [...selection]);
    //       } 
    //       // If we're given a single value, toggle it in the existing array
    //       else {
    //         const selectionIndex = existingSelection.indexOf(selection);
            
    //         if (selectionIndex === -1) {
    //           // Add if not present
    //           nextOptionSelections.set(optionId, [...existingSelection, selection]);
    //         } else {
    //           // Remove if present
    //           const updatedSelection = [...existingSelection];
    //           updatedSelection.splice(selectionIndex, 1);
    //           nextOptionSelections.set(optionId, updatedSelection);
    //         }
    //       }
          
       
    //       setOptionSelections(nextOptionSelections);
          
    //       // Update single selection tracking
    //       const nextSingleOptionSelection = new Map();
    //       nextSingleOptionSelection.set(optionId, selection);
       
    //       setSingleOptionSelection(nextSingleOptionSelection);
    //     },
    //     [optionSelections]
    //   );
      
      
    const  getProductDetailsByColor = useCallback((colorCode) =>{
        // Convert colorCode to integer for comparison
        const colorCodeInt = parseInt(colorCode);

     
        
        // Find color information from configurable options
        const colorOption = product.configurable_options.find(option => option.attribute_code === "color");
        if (!colorOption) {
          return { error: "Color option not found in product data" };
        }
        
        const selectedColor = colorOption.values.find(value => value.value_index === colorCodeInt);
        if (!selectedColor) {
          return { error: "Selected color not found" };
        }
        
        // Find size information from configurable options
        const sizeOption = product?.configurable_options?.find(option => option.attribute_code === "size");
        if (!sizeOption) {
          return { error: "Size option not found in product data" };
        }
        
        // Create result object with color information
        const result = {
            color: selectedColor,
          sizes: {}
        };
        
        // Process each size option
        sizeOption.values.forEach(size => {
          // Find variant for this color-size combination
          const variant = product?.variants?.find(v => 
            v.attributes.some(attr => attr.code === "color" && attr.value_index === colorCodeInt) &&
            v.attributes.some(attr => attr.code === "size" && attr.value_index === size.value_index)
          );
          
          // Default values in case variant isn't found
          let price = null;
          let sku = `Unknown-${size.default_label}-${selectedColor.default_label}`;
          let stockStatus = "UNKNOWN";
          let inventory = 0;
          
          // If we found the variant, extract its details
          if (variant) {
            price = variant.product.price.regularPrice.amount.value;
            sku = variant.product.sku;
            stockStatus = variant.product.stock_status;
            inventory = variant.product.qty;
          }
          
          // Add size details to result
          result.sizes[size.default_label] = {
            price: price,
            sku: sku,
            stock_status: stockStatus,
            size_index: size.value_index,
            inventory:inventory
          };
        });
        console.log("result", result);
        setSizesTable(result);
       
       
      },[product.configurable_options, product?.variants]);

   

    //   const getProductDetailsByColor = useCallback((colorCodes) => {
        
    //     // Initialize an object to store all results
    //     const updatedSizesTable = {};
    
    //     // Loop through each colorCode
    //     colorCodes?.forEach(colorCode => {
    //         const colorCodeInt = parseInt(colorCode);
    
           
    
    //         // Process color option and size option
    //         const colorOption = product.configurable_options.find(option => option.attribute_code === "color");
    //         if (!colorOption) {
    //             console.error("Color option not found in product data");
    //             return;
    //         }
    
    //         const selectedColor = colorOption.values.find(value => value.value_index === colorCodeInt);
    //         if (!selectedColor) {
    //             console.error("Selected color not found");
    //             return;
    //         }
    
    //         const sizeOption = product?.configurable_options?.find(option => option.attribute_code === "size");
    //         if (!sizeOption) {
    //             console.error("Size option not found in product data");
    //             return;
    //         }
    
    //         const result = {
    //             color: selectedColor,
    //             sizes: {}
    //         };
    
    //         // Loop through size options and fetch the variant information
    //         sizeOption?.values?.forEach(size => {
    //             const variant = product?.variants?.find(v =>
    //                 v.attributes.some(attr => attr.code === "color" && attr.value_index === colorCodeInt) &&
    //                 v.attributes.some(attr => attr.code === "size" && attr.value_index === size.value_index)
    //             );
    
    //             let price = null;
    //             let sku = `Unknown-${size.default_label}-${selectedColor.default_label}`;
    //             let stockStatus = "UNKNOWN";
    //             let inventory = 0;
    
    //             if (variant) {
    //                 price = variant.product.price.regularPrice.amount.value;
    //                 sku = variant.product.sku;
    //                 stockStatus = variant.product.stock_status;
    //                 inventory = variant.product.qty;
    //             }
    
    //             result.sizes[size.default_label] = {
    //                 price: price,
    //                 sku: sku,
    //                 stock_status: stockStatus,
    //                 size_index: size.value_index,
    //                 inventory: inventory,
    //                 size:size
    //             };
    //         });
    
    
    //         // Save to local object instead of state immediately
    //         updatedSizesTable[colorCodeInt] = result;
    //     });
    
    //     // Now update state after all colorCode iterations are done
    //     setSizesTable(updatedSizesTable);
    
    // }, [product.configurable_options, product?.variants]);
    

    // Normalization object for product details we need for rendering.
    const productDetails = {
        description: product.description,
        shortDescription: product.short_description,
        name: product.name,
        price: productPrice?.final_price,
        sku: product.sku
    };

    const derivedErrorMessage = useMemo(
        () =>
            deriveErrorMessage([
                errorAddingSimpleProduct,
                errorAddingConfigurableProduct,
                errorAddingProductToCart,
                ...(addToCartResponseData?.addProductsToCart?.user_errors || [])
            ]),
        [
            errorAddingConfigurableProduct,
            errorAddingProductToCart,
            errorAddingSimpleProduct,
            addToCartResponseData
        ]
    );

    const wishlistItemOptions = useMemo(() => {
        const options = {
            quantity: 1,
            sku: product.sku
        };

        if (productType === 'ConfigurableProduct') {
            options.selected_options = selectedOptionsArray;
        }

        return options;
    }, [product, productType, selectedOptionsArray]);

    const wishlistButtonProps = {
        buttonText: isSelected =>
            isSelected
                ? formatMessage({
                      id: 'wishlistButton.addedText',
                      defaultMessage: 'Added to Favorites'
                  })
                : formatMessage({
                      id: 'wishlistButton.addText',
                      defaultMessage: 'Add to Favorites'
                  }),
        item: wishlistItemOptions,
        storeConfig: storeConfigData ? storeConfigData.storeConfig : {}
    };


        // Update quantity state when user changes input
      const handleQuantityChange = (sku, value) => {
        setQuantities((prev) => ({
          ...prev,
          [sku]: Math.max(0, parseInt(value) || 0), // Ensure positive numbers
        }));
      };

    return {
        breadcrumbCategoryId,
        errorMessage: derivedErrorMessage,
        handleAddToCart,
        handleSelectionChange,
        isOutOfStock,
        isEverythingOutOfStock,
        outOfStockVariants,
        isAddToCartDisabled:
            isOutOfStock ||
            isEverythingOutOfStock ||
          
            isAddConfigurableLoading ||
            isAddSimpleLoading ||
            isAddProductLoading,
        isSupportedProductType,
        mediaGalleryEntries,
        shouldShowWishlistButton:
            isSignedIn &&
            storeConfigData &&
            !!storeConfigData.storeConfig.magento_wishlist_general_is_enabled,
        productDetails,
        customAttributes,
        wishlistButtonProps,
        wishlistItemOptions,
        getProductDetailsByColor,
        sizesTable,
        quantities,
        handleQuantityChange,
        isSignedIn
    };
};
