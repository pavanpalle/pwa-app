import React from 'react';
import { FormattedMessage } from 'react-intl';
import { shape, string } from 'prop-types';
import { X as CloseIcon } from 'react-feather';
import { useStyle } from '../../classify';
import Icon from '../Icon';
import { Portal } from '../Portal';
import defaultClasses from './addCardModal.module.css';
import CreditCardForm from './CreditCardForm ';
import { Form } from 'informed';
const AddCardModal = props => {
    const {
        classes: propClasses,
        isOpen,
        handleClose,
        handleAddPaymentMethod,
        isProcessing
    } = props;

    const classes = useStyle(defaultClasses, propClasses);
    const rootClass = isOpen ? classes.root_open : classes.root;

    const bodyElement = isOpen ? (
        <Form>
            <CreditCardForm
                handleClose={handleClose}
                handleAddPaymentMethod={handleAddPaymentMethod}
                isProcessing={isProcessing}
            />
        </Form>
    ) : null;

    return (
        <Portal>
            <aside className={rootClass}>
                <div className={classes.header}>
                    <span className={classes.headerText}>
                        <FormattedMessage
                            id={'savedPaymentPage.addNewCard'}
                            defaultMessage={'Add New Card'}
                        />
                    </span>
                    <button
                        className={classes.closeButton}
                        onClick={handleClose}
                    >
                        <Icon src={CloseIcon} />
                    </button>
                </div>
                <div className={classes.body}>{bodyElement}</div>
            </aside>
        </Portal>
    );
};

export default AddCardModal;

AddCardModal.propTypes = {
    classes: shape({
        root: string,
        root_open: string,
        body: string,
        header: string,
        headerText: string
    })
};
