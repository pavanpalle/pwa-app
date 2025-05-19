import { usePagination } from '@magento/peregrine/lib/talons/Pagination/usePagination';
import { func, number, shape, string } from 'prop-types';
import React, { useMemo } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';

import { useStyle } from '../../classify';
import Button from '../Button';
import { navButtons } from './constants';
import NavButton from './navButton';
import defaultClasses from './pagination.module.css';
import Tile from './tile';

const Pagination = props => {
    const { handleLoadMore, type } = props;
    const { currentPage, setPage, totalPages } = props.pageControl;
    const { formatMessage } = useIntl();
    const classes = useStyle(defaultClasses, props.classes);

    const talonProps = usePagination({
        currentPage,
        setPage,
        totalPages,
        handleLoadMore
    });

    const {
        handleNavBack,
        handleNavForward,
        isActiveLeft,
        isActiveRight,
        tiles
    } = talonProps;

    const navigationTiles = useMemo(
        () =>
            tiles.map(tileNumber => {
                return (
                    <Tile
                        isActive={tileNumber === currentPage}
                        key={tileNumber}
                        number={tileNumber}
                        onClick={setPage}
                    />
                );
            }),
        [currentPage, tiles, setPage]
    );

    if (totalPages === 1) {
        return null;
    }

    return (
        <div className={classes.root} data-cy="Pagination-root">
            {type === 'loadMore' ? (
                <div>
                    {isActiveRight && (
                        <Button
                            className={classes.loadMore}
                            //disabled={isFetchingMore}
                            onClick={handleNavForward}
                        >
                            <FormattedMessage
                                id={'pagination.loadMore'}
                                defaultMessage={'Load More Products'}
                            />
                        </Button>
                    )}
                </div>
            ) : (
                <div>
                    {isActiveLeft && (
                        <NavButton
                            name={navButtons.prevPage.name}
                            active={isActiveLeft}
                            onClick={handleNavBack}
                            buttonLabel={formatMessage({
                                id: 'pagination.prevPage',
                                defaultMessage: navButtons.prevPage.buttonLabel
                            })}
                        />
                    )}
                    {navigationTiles}
                    {isActiveRight && (
                        <NavButton
                            name={navButtons.nextPage.name}
                            active={isActiveRight}
                            onClick={handleNavForward}
                            buttonLabel={formatMessage({
                                id: 'pagination.nextPage',
                                defaultMessage: navButtons.nextPage.buttonLabel
                            })}
                        />
                    )}
                </div>
            )}
        </div>
    );
};

Pagination.propTypes = {
    classes: shape({
        root: string
    }),
    pageControl: shape({
        currentPage: number,
        setPage: func,
        totalPages: number
    }).isRequired
};

export default Pagination;
