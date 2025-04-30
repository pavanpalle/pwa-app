import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { bool, func, shape, string } from 'prop-types';
import { Form } from 'informed';

import { useStyle } from '../../../classify';
import { isRequired } from '../../../util/formValidators';
import Button from '../../Button';
import Field from '../../Field';
import GoogleReCaptcha from '../../GoogleReCaptcha';
import TextInput from '../../TextInput';
import defaultClasses from './forgotPasswordForm.module.css';
import loginImage from '../../SignIn/login-image.png';
import loginBg from '../../SignIn/login-bg.png';
import userIcon from '../../SignIn/user-icon.svg';
import Logo from '../../Logo';

const ForgotPasswordForm = props => {
    const classes = useStyle(defaultClasses, props.classes);
    const {
        initialValues,
        isResettingPassword,
        onSubmit,
        onCancel,
        recaptchaWidgetProps
    } = props;

    const { formatMessage } = useIntl();

    return (
        <div className='flex flex-row'>
            <div className='forgot-container'>
             <div className='signin-form-container'>
                <Logo/>
                <h1>Forgot Your Password?</h1>
                <p>Please enter the email address associated with this account</p>
                <Form
                    className={classes.root}
                    initialValues={initialValues}
                    onSubmit={onSubmit}
                    data-cy="forgotPasswordForm-root"
                >
                    <div className='field'>
                    <img src={userIcon} width={24} height={24} title="Username"/>
                     
                    <Field
                        label={formatMessage({
                            id: 'forgotPasswordForm.emailAddressText',
                            defaultMessage: 'Email address'
                        })}
                    >
                        <TextInput
                            autoComplete="email"
                            field="email"
                            validate={isRequired}
                            data-cy="email"
                        />
                    </Field>
                    </div>
                    <GoogleReCaptcha {...recaptchaWidgetProps} />
                    <div className={classes.buttonContainer}>
                        <Button
                            className={classes.cancelButton}
                            disabled={isResettingPassword}
                            type="button"
                            priority="low"
                            onClick={onCancel}
                        >
                            {/* <FormattedMessage
                                id={'forgotPasswordForm.cancelButtonText'}
                                defaultMessage={'Cancel'}
                            /> */}
                            Back to Login
                        </Button>
                        <Button
                            className={classes.submitButton}
                            disabled={isResettingPassword}
                            type="submit"
                            priority="high"
                            data-cy="forgotPasswordForm-submitButton"
                        >
                            <FormattedMessage
                                id={'forgotPasswordForm.submitButtonText'}
                                defaultMessage={'Submit'}
                            />
                        </Button>
                    </div>
                </Form>
                </div>
            </div>
            <div className='signin-right-container'>
                <img src={loginBg} width={100} height={100} className="w-full absolute top-0 left-0 h-full object-fit" />
                <div className='signin-image-container'>
                    <img src={loginImage} width={460} height={519} className="w-full relative" />
                    <h4>A leading supplier of apparel to the imprinted sportswear market</h4>
                </div>
            </div>
        </div>
    );
};

ForgotPasswordForm.propTypes = {
    classes: shape({
        form: string,
        buttonContainer: string
    }),
    initialValues: shape({
        email: string
    }),
    isResettingPassword: bool,
    onCancel: func.isRequired,
    onSubmit: func.isRequired
};

ForgotPasswordForm.defaultProps = {
    initialValues: {},
    isResettingPassword: false
};

export default ForgotPasswordForm;
