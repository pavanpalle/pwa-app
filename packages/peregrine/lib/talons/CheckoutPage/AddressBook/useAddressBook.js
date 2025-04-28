import { useMutation, useQuery } from '@apollo/client';
import mergeOperations from '@magento/peregrine/lib/util/shallowMerge';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import DEFAULT_OPERATIONS from './addressBook.gql';

import { useAppContext } from '../../../context/app';
import { useCartContext } from '../../../context/cart';
import { useUserContext } from '../../../context/user';
import { deriveErrorMessage } from '../../../util/deriveErrorMessage';

export const useAddressBook = props => {
    const {
        toggleActiveContent,
        onSuccess,
        setShowOverlay,
        setSuggestedAddress,
        suggestedAddress,
        validateAddress,
        setValidateAddress
    } = props;

    const operations = mergeOperations(DEFAULT_OPERATIONS, props.operations);
    const {
        setCustomerAddressOnCartMutation,
        getCustomerAddressesQuery,
        getCustomerCartAddressQuery,
        validateAddressMutation
    } = operations;

    const [, { toggleDrawer }] = useAppContext();
    const [{ cartId }] = useCartContext();
    const [{ isSignedIn }] = useUserContext();

    const addressCount = useRef();
    const [activeAddress, setActiveAddress] = useState();
    const [selectedAddress, setSelectedAddress] = useState();

    const [
        setCustomerAddressOnCart,
        {
            error: setCustomerAddressOnCartError,
            loading: setCustomerAddressOnCartLoading
        }
    ] = useMutation(setCustomerAddressOnCartMutation, {
        onCompleted: () => {
            onSuccess();
        }
    });

    const [
        validateCartAddress,
        { loading: validateAddressLoading }
    ] = useMutation(validateAddressMutation);

    const {
        data: customerAddressesData,
        loading: customerAddressesLoading
    } = useQuery(getCustomerAddressesQuery, {
        fetchPolicy: 'cache-and-network',
        nextFetchPolicy: 'cache-first',
        skip: !isSignedIn
    });

    const {
        data: customerCartAddressData,
        loading: customerCartAddressLoading
    } = useQuery(getCustomerCartAddressQuery, {
        fetchPolicy: 'cache-and-network',
        nextFetchPolicy: 'cache-first',
        skip: !isSignedIn
    });

    const derivedErrorMessage = useMemo(
        () => deriveErrorMessage([setCustomerAddressOnCartError]),
        [setCustomerAddressOnCartError]
    );

    const isLoading =
        customerAddressesLoading ||
        customerCartAddressLoading ||
        setCustomerAddressOnCartLoading ||
        validateAddressLoading;

    const customerAddresses = useMemo(
        () =>
            (customerAddressesData &&
                customerAddressesData.customer.addresses) ||
            [],
        [customerAddressesData]
    );

    useEffect(() => {
        if (customerAddresses.length !== addressCount.current) {
            // Auto-select newly added address when count changes
            if (addressCount.current) {
                const newestAddress =
                    customerAddresses[customerAddresses.length - 1];
                setSelectedAddress(newestAddress.id);
            }

            addressCount.current = customerAddresses.length;
        }
    }, [customerAddresses]);

    const handleEditAddress = useCallback(
        address => {
            setActiveAddress(address);
            toggleDrawer('shippingInformation.edit');
        },
        [toggleDrawer]
    );

    const handleAddAddress = useCallback(() => {
        handleEditAddress();
    }, [handleEditAddress]);

    const handleSelectAddress = useCallback(
        addressId => {
            if (customerAddresses.length) {
                const foundSelectedAddress = customerAddresses.find(
                    customerAddress => customerAddress.id === addressId
                );
                if (foundSelectedAddress) {
                    setValidateAddress(foundSelectedAddress);
                }
            }

            setSelectedAddress(addressId);
        },
        [customerAddresses, setValidateAddress]
    );

    // GraphQL doesn't return which customer address is selected, so perform
    // a simple search to initialize this selected address value.
    if (
        customerAddresses.length &&
        customerCartAddressData &&
        !selectedAddress
    ) {
        const { customerCart } = customerCartAddressData;
        const { shipping_addresses: shippingAddresses } = customerCart;
        if (shippingAddresses.length) {
            const primaryCartAddress = shippingAddresses[0];

            const foundSelectedAddress = customerAddresses.find(
                customerAddress =>
                    customerAddress.street[0] ===
                        primaryCartAddress.street[0] &&
                    customerAddress.firstname ===
                        primaryCartAddress.firstname &&
                    customerAddress.lastname === primaryCartAddress.lastname
            );

            if (foundSelectedAddress) {
                setSelectedAddress(foundSelectedAddress.id);
                setValidateAddress(foundSelectedAddress);
            }
        }
    }

    const isSuggestedAddressAllNull = data => {
        const suggestedAddress = data?.suggested_address;

        // If suggestedAddress is missing or not an object
        if (!suggestedAddress || typeof suggestedAddress !== 'object') {
            return true;
        }

        // Check if every value is null
        return Object.values(suggestedAddress).every(value => value === null);
    };

    const handleApplyAddress = useCallback(async () => {
        console.log('validateAddress', validateAddress);

        try {
            if (
                validateAddress.is_valid_address === null ||
                validateAddress.is_valid_address === '0'
            ) {
                // Step 1: Validate address via GraphQL mutation
                const data = await validateCartAddress({
                    variables: {
                        input: {
                            AddressLine: validateAddress.street[0] || '',
                            AddressLine2: validateAddress.street[1] || '',
                            City: validateAddress.city,
                            State: validateAddress.region.region_code,
                            Postcode: validateAddress.postcode,
                            CountryCode: validateAddress.country_code
                        }
                    }
                });

                const addressValidation = data?.data?.addressValidation;
                // Step 2: If valid or "Unknown", apply address to cart

                if (
                    addressValidation?.is_valid ||
                    addressValidation?.classification === 'Unknown'
                ) {
                    await setCustomerAddressOnCart({
                        variables: {
                            cartId,
                            addressId: selectedAddress
                        }
                    });
                    toggleActiveContent();
                }
                // Step 3: If invalid but has a suggestion, show suggestion
                else if (
                    !addressValidation?.is_valid &&
                    !isSuggestedAddressAllNull(addressValidation)
                ) {
                    setSuggestedAddress(addressValidation.suggested_address);
                    setShowOverlay(true);
                }
            } else {
                await setCustomerAddressOnCart({
                    variables: {
                        cartId,
                        addressId: selectedAddress
                    }
                });
                toggleActiveContent();
            }
        } catch (e) {
            console.log('e', e);
            return;
        }
    }, [
        cartId,
        selectedAddress,
        setCustomerAddressOnCart,
        setShowOverlay,
        setSuggestedAddress,
        toggleActiveContent,
        validateAddress,
        validateCartAddress
    ]);

    const handleCancel = useCallback(() => {
        setSelectedAddress();
        toggleActiveContent();
    }, [toggleActiveContent]);

    const handleAddressValidationCancel = useCallback(async () => {
        setShowOverlay(false);
        await setCustomerAddressOnCart({
            variables: {
                cartId,
                addressId: selectedAddress
            }
        });

        toggleActiveContent();
    }, [
        cartId,
        selectedAddress,
        setCustomerAddressOnCart,
        setShowOverlay,
        toggleActiveContent
    ]);

    const updateCustomerAddressWithSuggestion = (
        currentAddress,
        suggestedAddress
    ) => {
        if (!currentAddress || !suggestedAddress) return currentAddress;

        return {
            ...currentAddress,
            street: [suggestedAddress.AddressLine || currentAddress.street[0]],
            city: suggestedAddress.City || currentAddress.city,
            postcode: suggestedAddress.Postcode || currentAddress.postcode,
            country: {
                ...currentAddress.country,
                code:
                    suggestedAddress.CountryCode || currentAddress.country.code
            },
            region: {
                __typename: 'CustomerAddressRegion',
                region:
                    suggestedAddress.Region?.region ||
                    currentAddress.region.region,
                region_code:
                    suggestedAddress.Region?.region_code ||
                    currentAddress.region.region_code,
                region_id:
                    suggestedAddress.Region?.region_id ||
                    currentAddress.region.region_id
            }
        };
    };

    const handleAddressValidationSubmit = useCallback(() => {
        const address = updateCustomerAddressWithSuggestion(
            validateAddress,
            suggestedAddress
        );

        setActiveAddress(address);
        setShowOverlay(false);
        toggleDrawer('shippingInformation.edit');
        toggleActiveContent();
    }, [
        setShowOverlay,
        suggestedAddress,
        toggleActiveContent,
        toggleDrawer,
        validateAddress
    ]);

    return {
        activeAddress,
        customerAddresses,
        errorMessage: derivedErrorMessage,
        isLoading,
        handleAddAddress,
        handleApplyAddress,
        handleCancel,
        handleSelectAddress,
        handleEditAddress,
        selectedAddress,
        handleAddressValidationCancel,
        handleAddressValidationSubmit
    };
};
