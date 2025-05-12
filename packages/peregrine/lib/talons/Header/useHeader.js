import { useLocation } from 'react-router-dom';
import { useCallback, useMemo, useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { useAppContext } from '@magento/peregrine/lib/context/app';
import { useDropdown } from '@magento/peregrine/lib/hooks/useDropdown';
import { BrowserPersistence } from '@magento/peregrine/lib/util';
import { useUserContext } from '@magento/peregrine/lib/context/user';
import mergeOperations from '../../util/shallowMerge';
import DEFAULT_OPERATIONS from './headerLogo.gql';
const storage = new BrowserPersistence();
export const useHeader = (props = {}) => {
    const location = useLocation();
    const operations = mergeOperations(DEFAULT_OPERATIONS, props.operations);
    const { getHeaderLogoData } = operations;
    const [{ hasBeenOffline, isOnline, isPageLoading }] = useAppContext();
    const [{ isSignedIn: isUserSignedIn }] = useUserContext();
    const storeCode = storage.getItem('store_view_code') || "default";
    const mediaUrl = storage.getItem('store_view_secure_base_media_url') || "https://demoecommerce.sparity.com/media/";
    const {
        elementRef: searchRef,
        expanded: isSearchOpen,
        setExpanded: setIsSearchOpen,
        triggerRef: searchTriggerRef
    } = useDropdown();

    const { data: headerLogoData } = useQuery(getHeaderLogoData, {
        fetchPolicy: 'cache-and-network',
        nextFetchPolicy: 'cache-first'
    });

    const currentStoreName = useMemo(() => {
        if (headerLogoData) {
            return headerLogoData.storeConfig.store_name;
        }
    }, [headerLogoData]);
    const currentStoreLogo = useMemo(() => {
        if (headerLogoData) {
            return `${mediaUrl}logo/${headerLogoData.storeConfig.header_logo_src}`;
        }
    }, [headerLogoData,mediaUrl]);
    const handleSearchTriggerClick = useCallback(() => {
        // Toggle the Search input form.
        setIsSearchOpen(isOpen => !isOpen);
    }, [setIsSearchOpen]);
    
    useEffect(() => {
        const path = location.pathname;
 
        if (path === '/')
            document.documentElement.setAttribute('data-store', 'default');
        else if (path === '/headsweats')
            document.documentElement.setAttribute('data-store', 'headsweats');
        else if (path === '/recover')
            document.documentElement.setAttribute('data-store', 'recover');
        else document.documentElement.setAttribute('data-store', 'default');
    }, [location]);

    return {
        handleSearchTriggerClick,
        hasBeenOffline,
        isOnline,
        isPageLoading,
        isSearchOpen,
        searchRef,
        searchTriggerRef,
        storeCode,
        currentStoreName,
        currentStoreLogo,
        isUserSignedIn
    };
};
