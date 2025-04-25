import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { Form } from 'informed';
import { func, shape, string, bool } from 'prop-types';
import { useCreateAccount } from '@magento/peregrine/lib/talons/CreateAccount/useCreateAccount';

import { useStyle } from '../../classify';
import combine from '../../util/combineValidators';
import {
    hasLengthAtLeast,
    isRequired,
    validatePassword
} from '../../util/formValidators';
import Button from '../Button';
import Checkbox from '../Checkbox';
import Field from '../Field';
import TextInput from '../TextInput';
import defaultClasses from './createAccount.module.css';
import FormError from '../FormError';
import Password from '../Password';
import GoogleRecaptcha from '../GoogleReCaptcha';
import loginImage from './login-image.png';
import loginBg from './login-bg.png';

const CreateAccount = props => {
    const talonProps = useCreateAccount({
        initialValues: props.initialValues,
        onSubmit: props.onSubmit,
        onCancel: props.onCancel
    });

    const {
        errors,
        handleCancel,
        handleSubmit,
        handleEnterKeyPress,
        handleCancelKeyPress,
        isDisabled,
        initialValues,
        recaptchaWidgetProps,
        minimumPasswordLength
    } = talonProps;
    console.log('minimumPasswordLength==', minimumPasswordLength);
    const { formatMessage } = useIntl();
    const classes = useStyle(defaultClasses, props.classes);

    const cancelButton = props.isCancelButtonHidden ? null : (
        <Button
            data-cy="CreateAccount-cancelButton"
            className={classes.cancelButton}
            disabled={Boolean(isDisabled)}
            type="button"
            priority="low"
            onClick={handleCancel}
            onKeyDown={handleCancelKeyPress}
        >
            <FormattedMessage
                id={'createAccount.cancelText'}
                defaultMessage={'Cancel'}
            />
        </Button>
    );

    const submitButton = (
        <Button
            className={classes.submitButton}
            disabled={Boolean(isDisabled)}
            type="submit"
            priority="high"
            onKeyDown={handleEnterKeyPress}
            data-cy="CreateAccount-submitButton"
        >
            <FormattedMessage
                id={'createAccount.createAccountText'}
                defaultMessage={'Create an Account'}
            />
        </Button>
    );

    return (
        <div className='flex flex-row'>
        <div class="w-full flex items-center justify-center p-[50px]">
        <div className='w-full flex items-center justify-center'>
          
        <Form
            data-cy="CreateAccount-form"
            className={classes.root}
            initialValues={initialValues}
            onSubmit={handleSubmit}
        >
            <h2 data-cy="CreateAccount-title" className={classes.title}>
                <FormattedMessage
                    id={'createAccount.createAccountText'}
                    defaultMessage={'Create New Customer Account'}
                />
            </h2>
            <FormError errors={Array.from(errors.values())} />
            <div className='grid grid-cols-2 gap-8 gap-y-4'>  
            <Field
                id="companyName"
                label={formatMessage({
                    id: 'createAccount.companyNameText',
                    defaultMessage: 'Company Name'
                })}
            >
                <TextInput
                    id="companyName"
                    field="customer.companyname"
                    autoComplete="given-name"
                    validate={isRequired}
                    validateOnBlur
                    mask={value => value && value.trim()}
                    maskOnBlur={true}
                    data-cy="customer-companyname"
                    aria-label={formatMessage({
                        id: 'global.companyNameRequired',
                        defaultMessage: 'Company Name Required'
                    })}
                />
            </Field>
            <Field
                id="website"
                label={formatMessage({
                    id: 'createAccount.websiteText',
                    defaultMessage: 'Website'
                })}
            >
                <TextInput
                    id="website"
                    field="customer.website"
                    autoComplete="given-name"
                    validate={isRequired}
                    isRequired={true}
                    validateOnBlur
                    mask={value => value && value.trim()}
                    maskOnBlur={true}
                    data-cy="customer-website"
                    aria-label={formatMessage({
                        id: 'global.websiteRequired',
                        defaultMessage: 'website Required'
                    })}
                />
            </Field>

            <Field
                id="firstName"
                label={formatMessage({
                    id: 'createAccount.firstNameText',
                    defaultMessage: 'First Name'
                })}
            >
                <TextInput
                    id="firstName"
                    field="customer.firstname"
                    autoComplete="given-name"
                    validate={isRequired}
                    validateOnBlur
                    mask={value => value && value.trim()}
                    maskOnBlur={true}
                    data-cy="customer-firstname"
                    aria-label={formatMessage({
                        id: 'global.firstNameRequired',
                        defaultMessage: 'First Name Required'
                    })}
                />
            </Field>
            <Field
                id="lastName"
                label={formatMessage({
                    id: 'createAccount.lastNameText',
                    defaultMessage: 'Last Name'
                })}
            >
                <TextInput
                    id="lastName"
                    field="customer.lastname"
                    autoComplete="family-name"
                    validate={isRequired}
                    validateOnBlur
                    mask={value => value && value.trim()}
                    maskOnBlur={true}
                    data-cy="customer-lastname"
                    aria-label={formatMessage({
                        id: 'global.lastNameRequired',
                        defaultMessage: 'Last Name Required'
                    })}
                />
            </Field>
            <div className='col-span-2 w-full'>
            <Field
                id="Email"
                label={formatMessage({
                    id: 'createAccount.emailText',
                    defaultMessage: 'Email'
                })}
            >
                <TextInput
                    id="Email"
                    field="customer.email"
                    autoComplete="email"
                    validate={isRequired}
                    validateOnBlur
                    mask={value => value && value.trim()}
                    maskOnBlur={true}
                    data-cy="customer-email"
                    aria-label={formatMessage({
                        id: 'global.emailRequired',
                        defaultMessage: 'Email Required'
                    })}
                />
            </Field>
            </div>
            <Field
                id="phoneNumber"
                label={formatMessage({
                    id: 'createAccount.phoneNumberText',
                    defaultMessage: 'Phone Number'
                })}
            >
                <TextInput
                    id="phoneNumber"
                    field="customer.phoneNumber"
                    autoComplete="given-name"
                    validate={isRequired}
                    isRequired={true}
                    validateOnBlur
                    mask={value => value && value.trim()}
                    maskOnBlur={true}
                    data-cy="customer-phoneNumber"
                    aria-label={formatMessage({
                        id: 'global.phoneNumberRequired',
                        defaultMessage: 'Phone Number Required'
                    })}
                    placeholder="Phone Number"
                />
            </Field>
            <Field
                id="businessType"
                label={formatMessage({
                    id: 'createAccount.businessTypeText',
                    defaultMessage: 'Type of Business'
                })}
            >
                <TextInput
                    id="businessType"
                    field="customer.businessType"
                    autoComplete="given-name"
                    validate={isRequired}
                    isRequired={true}
                    validateOnBlur
                    mask={value => value && value.trim()}
                    maskOnBlur={true}
                    data-cy="customer-businessType"
                    aria-label={formatMessage({
                        id: 'global.businessTypeRequired',
                        defaultMessage: 'Type of Business Required'
                    })}
                />
            </Field>
            </div>
            <h3>COMPANY BILLING INFORMATION</h3>
            <div className='grid grid-cols-2 gap-8 gap-y-4'>
                
                <Field
                id="streetAddress1"
                label={formatMessage({
                    id: 'createAccount.streetAddress1Text',
                    defaultMessage: 'Street Address 1'
                })}
            >
                <TextInput
                    id="streetAddress1"
                    field="customer.streetAddress1"
                    autoComplete="given-name"
                    validate={isRequired}
                    isRequired={true}
                    validateOnBlur
                    mask={value => value && value.trim()}
                    maskOnBlur={true}
                    data-cy="customer-streetAddress1"
                    aria-label={formatMessage({
                        id: 'global.streetAddress1Required',
                        defaultMessage: 'Street Address 1 Required'
                    })}
                />
                </Field>
                <Field
                id="streetAddress2"
                label={formatMessage({
                    id: 'createAccount.streetAddress2Text',
                    defaultMessage: 'Street Address 2'
                })}
            >
                <TextInput
                    id="streetAddress2"
                    field="customer.streetAddress2"
                    autoComplete="given-name"
                    validate={isRequired}
                    isRequired={true}
                    validateOnBlur
                    mask={value => value && value.trim()}
                    maskOnBlur={true}
                    data-cy="customer-streetAddress2"
                    aria-label={formatMessage({
                        id: 'global.streetAddress2Required',
                        defaultMessage: 'Street Address 2 Required'
                    })}
                />
                </Field>
                <Field
                id="zipcode"
                label={formatMessage({
                    id: 'createAccount.zipcodeText',
                    defaultMessage: 'Zip Code'
                })}
            >
                <TextInput
                    id="zipcode"
                    field="customer.zipcode"
                    autoComplete="given-name"
                    validate={isRequired}
                    isRequired={true}
                    validateOnBlur
                    mask={value => value && value.trim()}
                    maskOnBlur={true}
                    data-cy="customer-zipcode"
                    aria-label={formatMessage({
                        id: 'global.zipcodeRequired',
                        defaultMessage: 'Zip Code Required'
                    })}
                />
                </Field>
                <Field
                id="city"
                label={formatMessage({
                    id: 'createAccount.cityText',
                    defaultMessage: 'City'
                })}
            >
                <TextInput
                    id="city"
                    field="customer.city"
                    autoComplete="given-name"
                    validate={isRequired}
                    isRequired={true}
                    validateOnBlur
                    mask={value => value && value.trim()}
                    maskOnBlur={true}
                    data-cy="customer-city"
                    aria-label={formatMessage({
                        id: 'global.cityRequired',
                        defaultMessage: 'City Required'
                    })}
                />
                </Field>
                <Field
                id="state"
                label={formatMessage({
                    id: 'createAccount.stateText',
                    defaultMessage: 'State/Province'
                })}
            >
                <TextInput
                    id="state"
                    field="customer.state"
                    autoComplete="given-name"
                    validate={isRequired}
                    isRequired={true}
                    validateOnBlur
                    mask={value => value && value.trim()}
                    maskOnBlur={true}
                    data-cy="customer-state"
                    aria-label={formatMessage({
                        id: 'global.stateRequired',
                        defaultMessage: 'State Required'
                    })}
                />
                </Field>
                <Field
                id="country"
                label={formatMessage({
                    id: 'createAccount.countryText',
                    defaultMessage: 'Country'
                })}
            >
                <TextInput
                    id="country"
                    field="customer.country"
                    autoComplete="given-name"
                    validate={isRequired}
                    isRequired={true}
                    validateOnBlur
                    mask={value => value && value.trim()}
                    maskOnBlur={true}
                    data-cy="customer-country"
                    aria-label={formatMessage({
                        id: 'global.countryRequired',
                        defaultMessage: 'Country Required'
                    })}
                />
                </Field>
                <Field
                id="taxCertificate"
                label={formatMessage({
                    id: 'createAccount.taxCertificateText',
                    defaultMessage: 'Tax Certificate'
                })}
            >
                <TextInput
                    id="taxCertificate"
                    field="customer.taxCertificate"
                    autoComplete="given-name"
                    validate={isRequired}
                    isRequired={true}
                    validateOnBlur
                    mask={value => value && value.trim()}
                    maskOnBlur={true}
                    data-cy="customer-taxCertificate"
                    aria-label={formatMessage({
                        id: 'global.taxCertificateRequired',
                        defaultMessage: 'Tax Certificate Required'
                    })}
                />
                </Field>
            </div>
            <h3>SIGN-IN INFORMATION</h3>
            <div className='grid grid-cols-1 gap-y-4'>
            <Password
                id="Password"
                autoComplete="new-password"
                fieldName="password"
                isToggleButtonHidden={false}
                label={formatMessage({
                    id: 'createAccount.passwordText',
                    defaultMessage: 'Password'
                })}
                validate={combine([
                    isRequired,
                    [hasLengthAtLeast, minimumPasswordLength],
                    validatePassword
                ])}
                validateOnBlur
                mask={value => value && value.trim()}
                maskOnBlur={true}
                data-cy="password"
                aria-label={formatMessage({
                    id: 'global.passwordRequired',
                    defaultMessage: 'Password Required'
                })}
            />
            <Password
                id="confirmPassword"
                autoComplete="confirm-password"
                fieldName="Confirm Password"
                isToggleButtonHidden={false}
                label={formatMessage({
                    id: 'createAccount.confirmPasswordText',
                    defaultMessage: 'Confirm Password'
                })}
                validate={combine([
                    isRequired,
                    [hasLengthAtLeast, minimumPasswordLength],
                    validatePassword
                ])}
                validateOnBlur
                mask={value => value && value.trim()}
                maskOnBlur={true}
                data-cy="confirmPassword"
                aria-label={formatMessage({
                    id: 'global.confirmPasswordRequired',
                    defaultMessage: 'Confirm Password Required'
                })}
            />
            </div>
            <div className={classes.subscribe}>
                <Checkbox
                    field="subscribe"
                    id="subscribe"
                    label={formatMessage({
                        id: 'createAccount.subscribeText',
                        defaultMessage: 'Subscribe to news and updates'
                    })}
                />
            </div>
            <GoogleRecaptcha {...recaptchaWidgetProps} />
            <div className={classes.actions}>
                {submitButton}
                {cancelButton}
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

CreateAccount.propTypes = {
    classes: shape({
        actions: string,
        lead: string,
        root: string,
        subscribe: string
    }),
    initialValues: shape({
        email: string,
        firstName: string,
        lastName: string
    }),
    isCancelButtonHidden: bool,
    onSubmit: func,
    onCancel: func
};

CreateAccount.defaultProps = {
    onCancel: () => {},
    isCancelButtonHidden: true
};

export default CreateAccount;
