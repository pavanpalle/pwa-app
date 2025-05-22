import React from 'react';
import { useStyle } from '@magento/venia-ui/lib/classify';
import defaultClasses from './videoPlayer.module.css';
import { Portal } from '../Portal';
import Icon from '../Icon';
import { X as CloseIcon } from 'react-feather';
const ProductVideoPlayer = props => {
    const { videoUrl, isOpen, onCancel } = props;

    const classes = useStyle(defaultClasses, props.classes);
    const rootClass = isOpen ? classes.root_open : classes.root;
    if (!videoUrl) {
        return null;
    }

    const youtubeRegExp = new RegExp(
        '^(?:https?://|//)?(?:www\\.|m\\.)?' +
            '(?:youtu\\.be/|youtube\\.com/(?:embed/|v/|watch\\?v=|watch\\?.+&v=))([\\w-]{11})(?![\\w-])'
    );
    const vimeoRegExp = new RegExp(
        'https?://(?:www\\.|player\\.)?vimeo.com/(?:channels/' +
            '(?:\\w+/)?|groups/([^/]*)/videos/|album/(\\d+)/video/|video/|)(\\d+)(?:$|/|\\?)'
    );

    let Video = '';

    if (
        videoUrl &&
        videoUrl.length &&
        (youtubeRegExp.test(videoUrl) || vimeoRegExp.test(videoUrl))
    ) {
        Video = (
            <div className={classes.container}>
                <iframe
                    className={classes.video}
                    title={videoUrl}
                    frameBorder="0"
                    allowFullScreen="1"
                    loading="lazy"
                    src={videoUrl}
                />
            </div>
        );
    } else if (url && url.length) {
        /* eslint-disable jsx-a11y/media-has-caption */
        Video = (
            <div className={classes.container}>
                <video
                    className={classes.video}
                    src={videoUrl}
                    autoPlay={autoplay}
                    muted={muted}
                    frameBorder="0"
                    controls={true}
                />
            </div>
        );
        /* eslint-enable jsx-a11y/media-has-caption */
    }


      const maybeCloseXButton =  (
            <button
                className={classes.headerButton}
                onClick={onCancel}
                type="reset"
            >
                <Icon src={CloseIcon} />
            </button>
        ) ;

    const videoDialog = (
        <div className={classes.form}>
            {/* The Mask. */}
            <button className={classes.mask} onClick={onCancel} type="cancel" />
            {/* The Dialog. */}

            <div className={classes.dialog}>
                {maybeCloseXButton}
                {Video}
                </div>
        </div>
    );

    return (
        <Portal>
            <aside className={rootClass} data-cy="VideoDialog-root">
                {videoDialog}
            </aside>
        </Portal>
    );
};

export default ProductVideoPlayer;
