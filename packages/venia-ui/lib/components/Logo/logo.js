import React from 'react';
import { useIntl } from 'react-intl';
import PropTypes from 'prop-types';
import { useStyle } from '../../classify';
import Image from '../Image';
import logo from './ng-logo.svg';
import headSweatsLogo from './headsweats_logo.svg';

/**
 * A component that renders a logo in the header.
 *
 * @kind functional component
 *
 * @param {props} props React component props
 *
 * @returns {React.Element} A React component that displays a logo.
 */
const Logo = props => {
    const { height, width, storeCode } = props;
    const classes = useStyle({}, props.classes);
    const { formatMessage } = useIntl();

    const title = formatMessage({
        id: 'logo.title',
        defaultMessage: storeCode === 'default' ? 'NgLabs' : 'Whole Sale'
    });

    return (
        <Image
            classes={{ image: classes.logo }}
            height={height}
            src={storeCode === 'default' ? logo : headSweatsLogo}
            alt={title}
            title={title}
            width={width}
        />
    );
};

/**
 * Props for the Logo component.
 *
 * @kind props
 *
 * @property {Object} classes An object containing the class names for the Logo component.
 * @property {string} classes.logo Classes for logo
 * @property {number} [height=18] Height of the logo.
 * @property {number} [width=102] Width of the logo.
 */
Logo.propTypes = {
    classes: PropTypes.shape({
        logo: PropTypes.string
    }),
    height: PropTypes.number,
    width: PropTypes.number
};

Logo.defaultProps = {
    height: 80,
    width: 80
};

export default Logo;
