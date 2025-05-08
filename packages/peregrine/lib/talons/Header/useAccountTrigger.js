import { useCallback } from 'react';

import { useDropdown } from '@magento/peregrine/lib/hooks/useDropdown';
import { useUserContext } from '@magento/peregrine/lib/context/user';
import { useHistory } from 'react-router-dom';
/**
 * The useAccountTrigger talon complements the AccountTrigger component.
 *
 * @returns {Object}    talonProps
 * @returns {Boolean}   talonProps.accountMenuIsOpen - Whether the menu that this trigger toggles is open or not.
 * @returns {Function}  talonProps.setAccountMenuIsOpen  - Set the value of accoutMenuIsOpen.
 * @returns {Ref}       talonProps.accountMenuRef - A React ref to the menu that this trigger toggles.
 * @returns {Ref}       talonProps.accountMenuTriggerRef - A React ref to the trigger element itself.
 * @returns {Function}  talonProps.handleTriggerClick - A function for handling when the trigger is clicked.
 */
export const useAccountTrigger = () => {
    const {
        elementRef: accountMenuRef,
        expanded: accountMenuIsOpen,
        setExpanded: setAccountMenuIsOpen,
        triggerRef: accountMenuTriggerRef
    } = useDropdown();
    const history = useHistory();
    const [{ isSignedIn: isUserSignedIn }] = useUserContext();
    const handleTriggerClick = useCallback(() => {
        // Toggle the Account Menu.

        // if (isUserSignedIn) {
        //     setAccountMenuIsOpen(isOpen => !isOpen);
        // } else {
        //     history.push('/sign-in');
        // }
        setAccountMenuIsOpen(isOpen => !isOpen);
    }, [setAccountMenuIsOpen]);

    return {
        accountMenuIsOpen,
        accountMenuRef,
        accountMenuTriggerRef,
        setAccountMenuIsOpen,
        handleTriggerClick,
        isUserSignedIn
    };
};
