import React from 'react';
import { useStyle } from '../../classify';
import defaultClasses from './comparableStyles.module.css';
import { useComparableStyles } from '@magento/peregrine/lib/talons/ComparableStyles/useComparableStyles';
import Gallery from '@magento/venia-ui/lib/components/Gallery';
import mapProduct from '@magento/venia-ui/lib/util/mapProduct';
import GalleryShimmer from '@magento/venia-ui/lib/components/Gallery/gallery.shimmer';
import ErrorView from '@magento/venia-ui/lib/components/ErrorView';
const Title = 'Comparable Styles';
const ComparableStyles = props => {
    const {isSignedIn}= props
    const talonProps = useComparableStyles();

    const { error, loading, product, itemRef } = talonProps;

    const classes = useStyle(defaultClasses, props.classes);
    const modifiedItems = product?.map(item => mapProduct(item));

    if (loading && !product)
        return <GalleryShimmer items={Array.from({ length: 12 }).fill(null)} />;
    if (error && !product) return <ErrorView />;
   

    return (
        <div ref={itemRef} className={classes.root}>
            <section className={classes.title}>
                <h3
                    aria-live="polite"
                    className={classes.productName}
                    data-cy="ComparableStyles-productName"
                >
                    <span>{Title}</span>
                </h3>

                <Gallery
                    items={modifiedItems || []}
                    classes={{ items: classes.galleryItems }}
                    from='detail'
                    isSignedIn={isSignedIn}
                />
            </section>
        </div>
    );
};

export default ComparableStyles;
