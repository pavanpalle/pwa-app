import React from 'react';
import { useIntl } from 'react-intl';
import { bool, shape, string } from 'prop-types';
import { Loader, User as AccountIcon } from 'react-feather';

import { useAccountChip } from '@magento/peregrine/lib/talons/AccountChip/useAccountChip';
import { useStyle } from '@magento/venia-ui/lib/classify';

import Icon from '../Icon';
import defaultClasses from './accountChip.module.css';
import { GET_CUSTOMER_DETAILS } from './accountChip.gql';
import userIcon from './user.svg'
import Image from '../Image';
/**
 * The AccountChip component shows an icon next to some text.
 * Sometimes the text is static, sometimes it is dynamic based on the user's name,
 * and it can also be a loading icon to indicate that we're fetching the user's name.
 *
 * @param {Object} props
 * @param {Object} props.classes - CSS classes to override element styles.
 * @param {String} props.fallbackText - The text to display when the user is not signed in
 *  or when we're loading details but don't want to show a loading icon.
 * @param {Boolean} props.shouldIndicateLoading - Whether we should show a loading icon or
 *  not when the user is signed in but we don't have their details (name) yet.
 */
const AccountChip = props => {
    const { fallbackText, shouldIndicateLoading } = props;

    const talonProps = useAccountChip({
        queries: {
            getCustomerDetailsQuery: GET_CUSTOMER_DETAILS
        }
    });
    const { currentUser, isLoadingUserName, isUserSignedIn } = talonProps;

    const classes = useStyle(defaultClasses, props.classes);
    const { formatMessage } = useIntl();

    const ariaLabelMyMenu =
        currentUser != null
            ? formatMessage({
                  id: 'Hi' + currentUser.firstname,
                  defaultMessage: 'Hi' + currentUser.firstname
              })
            : '';

    const ariaLabel = isUserSignedIn ? ariaLabelMyMenu : '';

    let chipText;
    if (!isUserSignedIn) {
        chipText = fallbackText;
    } else {
        if (!isLoadingUserName) {
            chipText = formatMessage(
                { id: 'accountChip.chipText', defaultMessage: 'Hi, {name}' },
                { name: currentUser.firstname }
            );
        } else if (shouldIndicateLoading) {
            chipText = <Icon classes={{ icon: classes.loader }} src={Loader} />;
        } else {
            chipText = fallbackText;
        }
    }

    return (
        <span className={classes.root}>
            {/* <Icon src={AccountIcon} /> */}
            <Image src={userIcon} 
               width={24}
               height={24} 
            />
            <span
                aria-label={ariaLabel}
                aria-atomic="true"
                aria-live="polite"
                data-cy="AccountChip-text"
                className={classes.text}
            >
                {chipText}
            </span>
        </span>
    );
};

export default AccountChip;

AccountChip.propTypes = {
    classes: shape({
        root: string,
        loader: string,
        text: string
    }),
    fallbackText: string,
    shouldIndicateLoading: bool
};

AccountChip.defaultProps = {
    fallbackText: 'Account',
    shouldIndicateLoading: false
};
