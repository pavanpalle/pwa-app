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
import LinkButton from '../LinkButton';
import Password from '../Password';
import FormError from '../FormError/formError';
import GoogleRecaptcha from '../GoogleReCaptcha';
import Logo from '../Logo';
import loginImage from './login-image.png';
import loginBg from './login-bg.png';
import userIcon from './user-icon.svg';
import passwordIcon from './password-icon.svg';
import Image from '../Image';

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
        handleCreateAccount,
        handleEnterKeyPress,
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

    return (
        <div className='flex flex-row'>
            <div data-cy="SignIn-root" className={classes.root}>
                <div className='signin-form-container'>
                <Logo />
                <span data-cy="SignIn-title" className={classes.title}>
                    <FormattedMessage
                        id={'signIn.titleText'}
                        defaultMessage={'Login'}
                    />
                </span>
                <p>If you have an account, sign in with your email address.</p>
                <FormError errors={Array.from(errors.values())} />
                <Form
                    getApi={setFormApi}
                    className={classes.form}
                    onSubmit={handleSubmit}
                    data-cy="SignIn-form"
                    initialValues={initialValues && initialValues}
                >
                    <div className='field'>
                    <Field
                        id="emailSignIn"
                        label={formatMessage({
                            id: 'signIn.emailAddressText',
                            defaultMessage: 'Email address'
                        })}
                    >
                        <img src={userIcon} width={24} height={24} title="Username"/>
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
                        <img src={passwordIcon} width={24} height={24} title='Passowrd' />
                        <Password
                        data-cy="SignIn-password"
                        fieldName="password"
                        id="Password"
                        label={formatMessage({
                            id: 'signIn.passwordText',
                            defaultMessage: 'Password'
                        })}
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
                    <div className={classes.forgotPasswordButtonContainer}>
                        <LinkButton
                            classes={forgotPasswordClasses}
                            type="button"
                            onClick={handleForgotPassword}
                            onKeyDown={forgotPasswordHandleEnterKeyPress}
                            data-cy="SignIn-forgotPasswordButton"
                        >
                            <FormattedMessage
                                id={'signIn.forgotPasswordText'}
                                defaultMessage={'Forgot Password?'}
                            />
                        </LinkButton>
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
                                id={'signIn.signInText'}
                                defaultMessage={'Login'}
                            />
                        </Button>
                    
                    </div>
                    <h3>New Customers</h3>
                    <p>Creating an account has many benefits: check out faster, 
                    keep more than one address, track orders and more.</p>
                    <div className={classes.buttonsContainer}>
                        
                        <Button
                            priority="normal"
                            type="button"
                            onClick={handleCreateAccount}
                            data-cy="CreateAccount-initiateButton"
                            onKeyDown={handleEnterKeyPress}
                        >
                            <FormattedMessage
                                id={'signIn.createAccountText'}
                                defaultMessage={'Create an Account'}
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
