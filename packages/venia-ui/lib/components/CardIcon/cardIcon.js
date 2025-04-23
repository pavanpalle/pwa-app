import React from 'react';
import { useIntl } from 'react-intl';
import PropTypes from 'prop-types';
import { useStyle } from '../../classify';
import Image from '../Image';
import logo from './ng-logo.svg';
import visa from './visaCard.svg';
import mastercard from './masterCard.svg';
import amex from './amexCard.svg';
import discover from './discoverCard.svg';
import jcb from './jcbCard.svg';
import diners from './dinersCard.svg';
import unionpay from './paypalCard.svg';
import maestro from './mastroCard.svg';
import unknownCard from './unknownCard.svg';

/**
 * A component that renders a logo in the header.
 *
 * @kind functional component
 *
 * @param {props} props React component props
 *
 * @returns {React.Element} A React component that displays a logo.
 */


function getCreditCardImage(cardType) {
    // Convert to lowercase to handle any capitalization
    const type = cardType.toLowerCase();

   
    
    // Map card types to their image paths
    const cardImages = {
      visa: visa,
      mastercard: mastercard,
      amex: amex,
      discover: discover,
      jcb: jcb,
      diners: diners,
      unionpay: unionpay,
      maestro: maestro,
      default: unknownCard,
    };
  
    // Return the specific card image or the default if not found
    return cardImages[type] || cardImages.default;
  }


const CardIcon = props => {
    const { height, width,cardType } = props;
    const classes = useStyle({}, props.classes);
   
console.log("getCreditCardImage(cardType)",getCreditCardImage(cardType))
    return (
        <Image
            classes={{ image: classes.logo }}
            height={height}
            src={getCreditCardImage(cardType)}
            alt={`${cardType} card`}
            title={`${cardType} card`}
            width={width}
            displayPlaceholder={false}
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
CardIcon.propTypes = {
    classes: PropTypes.shape({
        logo: PropTypes.string
    }),
    height: PropTypes.number,
    width: PropTypes.number
};

CardIcon.defaultProps = {
    height: 36,
    width: 57
};

export default CardIcon;