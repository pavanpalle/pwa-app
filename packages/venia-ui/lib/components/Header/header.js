import React, { Fragment, Suspense } from 'react';
import { shape, string } from 'prop-types';
import { Link, Route } from 'react-router-dom';

import Logo from '../Logo';
import AccountTrigger from './accountTrigger';
import CartTrigger from './cartTrigger';
import NavTrigger from './navTrigger';
import OnlineIndicator from './onlineIndicator';
import { useHeader } from '@magento/peregrine/lib/talons/Header/useHeader';
import resourceUrl from '@magento/peregrine/lib/util/makeUrl';

import { useStyle } from '../../classify';
import defaultClasses from './header.module.css';
import StoreSwitcher from './storeSwitcher';
import CurrencySwitcher from './currencySwitcher';
import MegaMenu from '../MegaMenu';
import PageLoadingIndicator from '../PageLoadingIndicator';
import { useIntl } from 'react-intl';
import CmsBlock from '../CmsBlock';
import SignIn from './signIn';
import headwearLogo from './headwear-logo.png';
import recoverLogo from './recover-logo.png';


const SearchBar = React.lazy(() => import('../SearchBar'));

const Header = props => {
    const {
        hasBeenOffline,
        isOnline,
        isSearchOpen,
        searchRef,
        storeCode,
        currentStoreName,
        currentStoreLogo,
        isUserSignedIn
    } = useHeader();

    const classes = useStyle(defaultClasses, props.classes);
    const rootClass = isSearchOpen ? classes.open : classes.open;

    const searchBarFallback = (
        <div className={classes.searchFallback} ref={searchRef}>
            <div className={classes.input}>
                <div className={classes.loader}>
                    <div className={classes.loaderBefore} />
                    <div className={classes.loaderAfter} />
                </div>
            </div>
        </div>
    );
    // const searchBar = isSearchOpen ? (
    //     <Suspense fallback={searchBarFallback}>
    //         <Route>
    //             <SearchBar isOpen={isSearchOpen} ref={searchRef} />
    //         </Route>
    //     </Suspense>
    // ) : null;

    const { formatMessage } = useIntl();
    const title = formatMessage({ id: 'logo.title', defaultMessage: 'NgLabs' });

    return (
        <Fragment>
            <div className={classes.switchersContainer}>
                <div className={classes.switchers} data-cy="Header-switchers">
                    <StoreSwitcher />
                    <CurrencySwitcher />
                </div>
            </div>
            <div className={classes.broadcastMessages}>
                <CmsBlock identifiers="broadcast-message" />
            </div>
            <header className={rootClass} data-cy="Header-root">
                {/* <div className={classes.headerTopBar}>
                    <CmsBlock identifiers="header-top-bar" />
                </div> */}
                <div className={classes.toolbar}>
                    <div className={classes.primaryActions}>
                        <NavTrigger />
                    </div>
                    <div className={classes.logosGroup}>
                    <Link
                        aria-label={title}
                        to={resourceUrl('/')}
                        className={classes.logoContainer}
                        data-cy="Header-logoContainer"
                    >
                        <Logo
                            classes={{ logo: classes.logo }}
                            storeCode={storeCode}
                            currentStoreName={currentStoreName}
                            currentStoreLogo={currentStoreLogo}
                        />
                    </Link>
                    <Link
                        aria-label={title}
                        to={resourceUrl('/headsweats')}
                        className={classes.customLogo}
                    >
                        <img src={headwearLogo}
                        width={300}
                        height={97} 
                        alt='Headsweats Logo'
                        />
                    </Link>
                    <Link
                        aria-label={title}
                        to={resourceUrl('/recover')}
                        className={classes.customLogo}
                    >
                        <img src={recoverLogo}
                        width={300}
                        height={97}
                        alt='Recover Logo'
                        />
                    </Link>
                    </div>
                    {/* {searchBar} */}
                    {isUserSignedIn ? (
                        <div className={classes.secondaryActions}>
                            <AccountTrigger />
                            <CartTrigger />
                        </div>
                    ) : (
                        <div className={classes.secondaryActions}>
                           <SignIn/>
                            <div className={classes.mobileSignin}>
                             <AccountTrigger />
                            </div>
                        </div>
                    )}
                </div>
                <div className={classes.menuSearchGroup}>
                    <MegaMenu />
                    <div className={classes.searchBox}>
                        <Suspense fallback={searchBarFallback}>
                            <Route>
                                <SearchBar ref={searchRef} />
                            </Route>
                        </Suspense>
                    </div>
                </div>
                <PageLoadingIndicator absolute />
            </header>
            <OnlineIndicator
                hasBeenOffline={hasBeenOffline}
                isOnline={isOnline}
            />
        </Fragment>
    );
};

Header.propTypes = {
    classes: shape({
        closed: string,
        logo: string,
        open: string,
        primaryActions: string,
        secondaryActions: string,
        toolbar: string,
        switchers: string,
        switchersContainer: string
    })
};

export default Header;
