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

const SearchBar = React.lazy(() => import('../SearchBar'));

const Header = props => {
    const {
        hasBeenOffline,
        isOnline,
        isSearchOpen,
        searchRef,
        storeCode,
        currentStoreName,
        currentStoreLogo
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
            <header className={rootClass} data-cy="Header-root">
                <CmsBlock identifiers="header-top-bar" />
                <div className={classes.toolbar}>
                    <div className={classes.primaryActions}>
                        <NavTrigger />
                    </div>

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
                    {/* {searchBar} */}
                    
                    <div className={classes.secondaryActions}>
                        <div className='header-login-form'>
                            <form>
                            <ul>
                                <li><input type="text" className='input'/></li>
                                <li><input type="passwrod" className='text-input'/></li>
                                <li><input type="checkbox"/> <label>Stay Logged In</label></li>
                                <li><a href="#">Forgot Password?</a></li>
                            </ul>
                            <button type="submit">Login</button>
                            </form>
                        </div>
                        {/* <SearchTrigger
                            onClick={handleSearchTriggerClick}
                            ref={searchTriggerRef}
                        /> */}
                        <AccountTrigger />
                        <CartTrigger />
                    </div>
                    
                </div>
                <div className='menu-search-group'>
                    <MegaMenu />
                        <div className="search-box">
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
