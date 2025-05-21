import { array, number, shape, string } from 'prop-types';
import React, { Fragment, Suspense, useMemo, useRef } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';

import { useIsInViewport } from '@magento/peregrine/lib/hooks/useIsInViewport';
import { useCategoryContent } from '@magento/peregrine/lib/talons/RootComponents/Category';

import { useStyle } from '../../classify';
import Breadcrumbs from '../../components/Breadcrumbs';
import CmsBlock from '../../components/CmsBlock';
import FilterModalOpenButton, {
    FilterModalOpenButtonShimmer
} from '../../components/FilterModalOpenButton';
import { FilterSidebarShimmer } from '../../components/FilterSidebar';
import Gallery, { GalleryShimmer } from '../../components/Gallery';
import { StoreTitle } from '../../components/Head';
import ResourceImage from '../../components/Image/resourceImage';
import Pagination from '../../components/Pagination';
import ProductPerPage from '../../components/ProductPerPage';
import ProductSort, { ProductSortShimmer } from '../../components/ProductSort';
import RichContent from '../../components/RichContent';
import Shimmer from '../../components/Shimmer';
import SortedByContainer, {
    SortedByContainerShimmer
} from '../../components/SortedByContainer';
import defaultClasses from './category.module.css';
import NoProductsFound from './NoProductsFound';
const FilterModal = React.lazy(() => import('../../components/FilterModal'));
const FilterSidebar = React.lazy(() =>
    import('../../components/FilterSidebar')
);



const CategoryContent = props => {
    const {
        categoryId,
        data,
        isLoading,
        pageControl,
        sortProps,
        pageSize,
        handleLoadMore
    } = props;
    const [currentSort] = sortProps;
 const { formatMessage } = useIntl();
    const talonProps = useCategoryContent({
        categoryId,
        data,
        pageSize
    });

    const {
        availableSortMethods,
        categoryName,
        categoryDescription,
        filters,
        setFilterOptions,
        items,
        totalCount,
        totalPagesFromData,
        categoryBannerImage
    } = talonProps;

    const sidebarRef = useRef(null);
    const classes = useStyle(defaultClasses, props.classes);
    const shouldRenderSidebarContent = useIsInViewport({
        elementRef: sidebarRef
    });

    const shouldShowFilterButtons = filters && filters.length;
    const shouldShowFilterShimmer = filters === null;

    // If there are no products we can hide the sort button.
    const shouldShowSortButtons = totalPagesFromData && availableSortMethods;
    const shouldShowSortShimmer = !totalPagesFromData && isLoading;

    const maybeFilterButtons = shouldShowFilterButtons ? (
        <FilterModalOpenButton filters={filters} />
    ) : shouldShowFilterShimmer ? (
        <FilterModalOpenButtonShimmer />
    ) : null;

    const filtersModal = shouldShowFilterButtons ? (
        <FilterModal filters={filters} />
    ) : null;

    const sidebar = shouldShowFilterButtons ? (
        <FilterSidebar filters={filters} setFilterOptions={setFilterOptions} />
    ) : shouldShowFilterShimmer ? (
        <FilterSidebarShimmer />
    ) : null;

    const maybeSortButton = shouldShowSortButtons ? (
        <ProductSort
            sortProps={sortProps}
            availableSortMethods={availableSortMethods}
        />
    ) : shouldShowSortShimmer ? (
        <ProductSortShimmer />
    ) : null;

    const maybeSortContainer = shouldShowSortButtons ? (
        <SortedByContainer currentSort={currentSort} />
    ) : shouldShowSortShimmer ? (
        <SortedByContainerShimmer />
    ) : null;


     
    
            const productsPerPage =
        totalCount > 0 ? (
            <ProductPerPage/>
        )  : null;
            
    const categoryResultsHeading =
        totalCount > 0 ? (
            <div>
                <FormattedMessage
                    id={'categoryContent.resultCount'}
                    values={{
                        count: totalCount
                    }}
                    defaultMessage={'{count} Results'}
                />{' '}
            </div>
        ) : isLoading ? (
            <Shimmer width={5} />
        ) : null;

    const categoryDescriptionElement = categoryDescription ? (
        <RichContent html={categoryDescription} />
    ) : null;

    const content = useMemo(() => {
        if (!totalPagesFromData && !isLoading) {
            return <NoProductsFound categoryId={categoryId} />;
        }

        const gallery = totalPagesFromData ? (
            <Gallery items={items}  />
        ) : (
            <GalleryShimmer items={items} />
        );

        const pagination = totalPagesFromData ? (
            <Pagination pageControl={pageControl} handleLoadMore={handleLoadMore} type="loadMore" isLoading={isLoading}/>
        ) : null;


         

        return (
            <Fragment>
                <section className={classes.gallery}>{gallery}</section>
                <div className={classes.pagination}>{pagination}</div>
            </Fragment>
        );
    }, [categoryId, classes, isLoading, items, pageControl, totalPagesFromData,handleLoadMore]);

    const categoryTitle = categoryName ? categoryName : <Shimmer width={5} />;
    // const categoryImage = data?.category?.image;
    return (
        <Fragment>
            <div>
            {/* <div className="category-banner-block">
                <img src={categoryBg} 
                                           width={1000}
                                           height={90} 
                                        />
                <h2>{categoryTitle}</h2>
                </div> */}
                <Breadcrumbs categoryId={categoryId} />
                <StoreTitle>{categoryName}</StoreTitle>
                <article
                    className={classes.root}
                    data-cy="CategoryContent-root"
                >
                    
                    <div className={classes.contentWrapper}>
                        <div ref={sidebarRef} className={classes.sidebar}>
                            <Suspense fallback={<FilterSidebarShimmer />}>
                                {shouldRenderSidebarContent ? sidebar : null}
                            </Suspense>
                        </div>
                        <div className={classes.categoryContent}>
                            <div className={classes.categoryHeader}>
                        <h1 aria-live="polite" className={classes.title}>
                            <div
                                className={classes.categoryTitle}
                                data-cy="CategoryContent-categoryTitle"
                            >
                                <div>{categoryTitle}</div>
                            </div>
                        </h1>
                         <div className={classes.categoryPromoBanner}>
                            
                                <div>{categoryBannerImage ? (
                                    <ResourceImage
                                        resource={categoryBannerImage}
                                        alt={categoryName}
                                        width={1000}
                                        height={700}
                                    />
                                ) : null}</div>
                                <div><CmsBlock identifiers="promotion-banner" /></div>
                             </div>
                        {categoryDescriptionElement}
                    </div>
                            <div className={classes.heading}>
                                <div
                                    data-cy="CategoryContent-categoryInfo"
                                    className={classes.categoryInfo}
                                >
 
                                </div>
                                <div className={classes.headerButtons}>
                                    {productsPerPage}
                                    {categoryResultsHeading}
                                    {maybeFilterButtons}
                                    {maybeSortButton}
                                </div>
                                {maybeSortContainer}
                            </div>
                            {content}
                            <Suspense fallback={null}>{filtersModal}</Suspense>
                        </div>
                    </div>
                </article>
            </div>
        </Fragment>
    );
};

export default CategoryContent;

CategoryContent.propTypes = {
    classes: shape({
        gallery: string,
        pagination: string,
        root: string,
        categoryHeader: string,
        title: string,
        categoryTitle: string,
        sidebar: string,
        categoryContent: string,
        heading: string,
        categoryInfo: string,
        headerButtons: string
    }),
    // sortProps contains the following structure:
    // [{sortDirection: string, sortAttribute: string, sortText: string},
    // React.Dispatch<React.SetStateAction<{sortDirection: string, sortAttribute: string, sortText: string}]
    sortProps: array,
    pageSize: number
};
