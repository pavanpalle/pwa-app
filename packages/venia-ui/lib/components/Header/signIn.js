import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { func, shape, string } from 'prop-types';
import { Form } from 'informed';
import { useSignIn } from '@magento/peregrine/lib/talons/SignIn/useSignIn';

import { useStyle } from '../../classify';
import { isRequired } from '../../util/formValidators';
import Button from '../Button';
import Field from '../Field';
import TextInput from '../TextInput';
import defaultClasses from './signIn.module.css';
import { GET_CART_DETAILS_QUERY } from './signIn.gql';

import Password from '../Password';
import FormError from '../FormError/formError';
import GoogleRecaptcha from '../GoogleReCaptcha';

import userIcon from './user-icon.svg';
import passwordIcon from './password-icon.svg';
import Checkbox from '../Checkbox';
import { Link } from 'react-router-dom';

const SignIn = props => {
    const classes = useStyle(defaultClasses, props.classes);
    const {
        setDefaultUsername,
        showCreateAccount,
        showForgotPassword,
        initialValues
    } = props;

    const { formatMessage } = useIntl();
    const talonProps = useSignIn({
        getCartDetailsQuery: GET_CART_DETAILS_QUERY,
        setDefaultUsername,
        showCreateAccount,
        showForgotPassword
    });

    const {
        errors,
        signinHandleEnterKeyPress,
        handleForgotPassword,
        forgotPasswordHandleEnterKeyPress,
        handleSubmit,
        isBusy,
        setFormApi,
        recaptchaWidgetProps
    } = talonProps;

    const forgotPasswordClasses = {
        root: classes.forgotPasswordButton
    };

    console.log('recaptchaWidgetProps', recaptchaWidgetProps);
    return (
        <div className="flex flex-row">
            <div data-cy="SignIn-root" className={classes.root}>
                <div className="signin-form-container">
                    <FormError errors={Array.from(errors.values())} />
                    <Form
                        getApi={setFormApi}
                        className={classes.form}
                        onSubmit={handleSubmit}
                        data-cy="SignIn-form"
                        initialValues={initialValues && initialValues}
                    >
                        <div className="field">
                            <Field id="emailSignIn">
                                <img
                                    src={userIcon}
                                    width={24}
                                    height={24}
                                    title="Username"
                                />
                                <TextInput
                                    id="emailSignIn"
                                    data-cy="SignIn-email"
                                    autoComplete="email"
                                    field="email"
                                    validate={isRequired}
                                    data-cy="email"
                                    aria-label={formatMessage({
                                        id: 'global.emailRequired',
                                        defaultMessage: 'Email Required'
                                    })}
                                    placeholder="Username"
                                />
                            </Field>
                        </div>
                        <div class="field">
                            <img
                                src={passwordIcon}
                                width={24}
                                height={24}
                                title="Passowrd"
                            />
                            <Password
                                data-cy="SignIn-password"
                                fieldName="password"
                                id="Password"
                                validate={isRequired}
                                autoComplete="current-password"
                                isToggleButtonHidden={false}
                                data-cy="password"
                                aria-label={formatMessage({
                                    id: 'global.passwordRequired',
                                    defaultMessage: 'Password Required'
                                })}
                                placeholder="Password"
                            />
                        </div>
                        {/* <Checkbox
                            field="stayLoggedIn"
                            id="stayLoggedIn"
                            label={formatMessage({
                                id: 'SignIn.stayLoggedIn',
                                defaultMessage: 'Stay Logged In'
                            })}
                        /> */}
                          <Link
                                classes={forgotPasswordClasses}
                                to={'/create-account'}
                            >New Customer Signup</Link> 

                        <div className={classes.forgotPasswordButtonContainer}>
                            <Link
                                classes={forgotPasswordClasses}
                                to={'/forgot-password'}
                            >
                              
                                <FormattedMessage
                                    id={'signIn.forgotPasswordText'}
                                    defaultMessage={'Forgot Password?'}
                                />
                            </Link>
                            
                        </div>
                        <GoogleRecaptcha {...recaptchaWidgetProps} />
                        <div className={classes.buttonsContainer}>
                            <Button
                                priority="high"
                                type="submit"
                                onKeyDown={signinHandleEnterKeyPress}
                                data-cy="SignInButton-root_highPriority"
                                disabled={Boolean(isBusy)}
                            >
                                <FormattedMessage
                                    id={'signIn.loginInText'}
                                    defaultMessage={'Login'}
                                />
                            </Button>
                        </div>
                    </Form>
                </div>
            </div>
        </div>
    );
};

export default SignIn;
SignIn.propTypes = {
    classes: shape({
        buttonsContainer: string,
        form: string,
        forgotPasswordButton: string,
        forgotPasswordButtonContainer: string,
        root: string,
        title: string
    }),
    setDefaultUsername: func,
    showCreateAccount: func,
    showForgotPassword: func,
    initialValues: shape({
        email: string.isRequired
    })
};
SignIn.defaultProps = {
    setDefaultUsername: () => {},
    showCreateAccount: () => {},
    showForgotPassword: () => {}
};
