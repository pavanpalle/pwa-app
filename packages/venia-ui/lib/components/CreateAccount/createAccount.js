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
import RadioOption from '../RadioGroup/radio';

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
            {/* <FormattedMessage
                id={'createAccount.cancelText'}
                defaultMessage={'Cancel'}
            /> */}
            Back to Login
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
                {/* <FormattedMessage
                    id={'createAccount.createAccountText'}
                    defaultMessage={'Create New Customer Account'}
                /> */}
                <Button 
                 onClick={handleCancel}
                 onKeyDown={handleCancelKeyPress}
                >&#x27F5;</Button>
                Register
            </h2>
            <p>To open an account with NG Labs (Booxercraft, Recover & Headsweats), please complete and submit the form below with the required State Tax License and Resale Certificates. </p>
            <p>Please call <strong>800-914-7774</strong></p>
            <FormError errors={Array.from(errors.values())} />
            <div className='grid grid-cols-2 gap-8 gap-y-8'>  
                <div className='grid gap-2 w-full'>        
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
                    {/* <Field
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
                    </Field> */}

                    <Field
                        id="firstName"
                        label={formatMessage({
                            id: 'createAccount.primaryContactNameText',
                            defaultMessage: 'Primary Contact Name'
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
                                defaultMessage: 'Primary Contact Name Required'
                            })}
                        />
                    </Field>
                    {/* <Field
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
                    </Field> */}
                    <Field
                        id="jobTitle"
                        label={formatMessage({
                            id: 'createAccount.primaryContactJobTitleText',
                            defaultMessage: 'Primary Contact Job Title'
                        })}
                    >
                        <TextInput
                            id="jobTitle"
                            field="customer.jobTitle"
                            autoComplete="given-name"
                            validate={isRequired}
                            isRequired={true}
                            validateOnBlur
                            mask={value => value && value.trim()}
                            maskOnBlur={true}
                            data-cy="customer-jobTitle"
                            aria-label={formatMessage({
                                id: 'global.jobTitleRequired',
                                defaultMessage: 'Primary Contact Job Title Required'
                            })}
                        />
                    </Field>
                    <Field
                        id="phoneNumber"
                        label={formatMessage({
                            id: 'createAccount.primaryContactPhoneNumberText',
                            defaultMessage: 'Primary Contact Job Title'
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
                                defaultMessage: 'Primary Contact Phone Number Required'
                            })}
                        />
                    </Field>
                    <Field
                        id="Email"
                        label={formatMessage({
                            id: 'createAccount.primaryContactEmailAddressText',
                            defaultMessage: 'Primary Contact Email Address'
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
                                defaultMessage: 'Primary Contact Email Address Required'
                            })}
                        />
                    </Field>
<Field
                        id="Estabalished"
                        label={formatMessage({
                            id: 'createAccount.establishedText',
                            defaultMessage: 'Year Business Was Estabalished'
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
                                defaultMessage: 'Year Business Was Estabalished Required'
                            })}
                        />
                    </Field>
                    
                    <Field
                        id="EmpIdentification"
                        label={formatMessage({
                            id: 'createAccount.employeeIdentificationText',
                            defaultMessage: 'EIN - Employer Identification'
                        })}
                    >
                        <TextInput
                            id="EmpIdentification"
                            field="customer.empidentification"
                            autoComplete="email"
                            validate={isRequired}
                            validateOnBlur
                            mask={value => value && value.trim()}
                            maskOnBlur={true}
                            data-cy="customer-email"
                            aria-label={formatMessage({
                                id: 'global.emailRequired',
                                defaultMessage: 'EIN - Employer Identification Required'
                            })}
                        />
                    </Field>
                    
                    <Field
                        id="dbStreet"
                        label={formatMessage({
                            id: 'createAccount.dbStreetText',
                            defaultMessage: 'D&B # - Dunn Bradstreet'
                        })}
                    >
                        <TextInput
                            id="dbStreet"
                            field="customer.dbStreet"
                            autoComplete="given-name"
                            validate={isRequired}
                            isRequired={true}
                            validateOnBlur
                            mask={value => value && value.trim()}
                            maskOnBlur={true}
                            data-cy="customer-dbStreet"
                            aria-label={formatMessage({
                                id: 'global.dbStreetRequired',
                                defaultMessage: 'D&B # - Dunn Bradstreet Required'
                            })}
                        />
                    </Field>
                    <Field
                        id="businessType"
                        label={formatMessage({
                            id: 'createAccount.businessTypeText',
                            defaultMessage: 'Business Type'
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
                                defaultMessage: 'Business Type Required'
                            })}
                        />
                    </Field>
                    <Field
                        id="marketType"
                        label={formatMessage({
                            id: 'createAccount.marketTypeText',
                            defaultMessage: 'Market Type'
                        })}
                    >
                        <TextInput
                            id="marketType"
                            field="customer.marketType"
                            autoComplete="given-name"
                            validate={isRequired}
                            isRequired={true}
                            validateOnBlur
                            mask={value => value && value.trim()}
                            maskOnBlur={true}
                            data-cy="customer-marketType"
                            aria-label={formatMessage({
                                id: 'global.marketTypeRequired',
                                defaultMessage: 'Market Type Required'
                            })}
                        />
                    </Field>
                    <Field
                        id="projectedAnnualSales"
                        label={formatMessage({
                            id: 'createAccount.projectedAnnualSalesText',
                            defaultMessage: 'Projected Annual Sales'
                        })}
                    >
                        <TextInput
                            id="projectedAnnualSales"
                            field="customer.projectedAnnualSales"
                            autoComplete="given-name"
                            validate={isRequired}
                            isRequired={true}
                            validateOnBlur
                            mask={value => value && value.trim()}
                            maskOnBlur={true}
                            data-cy="customer-projectedAnnualSales"
                            aria-label={formatMessage({
                                id: 'global.projectedAnnualSalesRequired',
                                defaultMessage: 'Projected Annual Sales Required'
                            })}
                        />
                    </Field>
                    <Field
                        id="projectedAnnualPurchases"
                        label={formatMessage({
                            id: 'createAccount.projectedAnnualPurchasesText',
                            defaultMessage: 'Projected Annual Purchases'
                        })}
                    >
                        <TextInput
                            id="projectedAnnualPurchases"
                            field="customer.projectedAnnualPurchases"
                            autoComplete="given-name"
                            validate={isRequired}
                            isRequired={true}
                            validateOnBlur
                            mask={value => value && value.trim()}
                            maskOnBlur={true}
                            data-cy="customer-projectedAnnualPurchases"
                            aria-label={formatMessage({
                                id: 'global.projectedAnnualPurchasesRequired',
                                defaultMessage: 'Projected Annual Purchases Required'
                            })}
                        />
                    </Field>
                    <div className={classes.fieldRow}>
                    <label>Shipping Address*</label>       
                    <ul className={classes.checkboxList}>
                            <li>
                                <input type="radio" />
                                <label>One Address</label>
                            </li>
                            <li>
                                <input type="radio" />
                                <label>Multiple Address</label>
                            </li>
                        </ul>     
                    </div>
                    <div className={classes.fieldRow}>
                    <label>Shipping Method*</label>       
                    <ul className={classes.checkboxList}>
                            <li>
                                <input type="radio" />
                                <label>Prepaid (Freight Included on Invoice)</label>
                            </li>
                            <li>
                                <input type="radio" />
                                <label>Freight Collect</label>
                            </li>
                        </ul>     
                    </div>
                    <div className={classes.fieldRow}>
                    <label>Payment Terms*</label>       
                    <ul className={classes.checkboxList}>
                            <li>
                                <input type="radio" />
                                <label>Pay in Advance</label>
                            </li>
                            <li>
                                <input type="radio" />
                                <label>Net 30 Terms (Subject to approval by Wells Factoring Services)</label>
                            </li>
                        </ul>     
                    </div>
                </div>
           <div className='grid gap-2 w-full'> 
            {/* <h3>COMPANY BILLING INFORMATION</h3> */}
                <Field
                id="billingAddress"
                label={formatMessage({
                    id: 'createAccount.billingAddress1Text',
                    defaultMessage: 'Billing Address'
                })}
            >
                <TextInput
                    id="billingAddress"
                    field="customer.billingAddress"
                    autoComplete="given-name"
                    validate={isRequired}
                    isRequired={true}
                    validateOnBlur
                    mask={value => value && value.trim()}
                    maskOnBlur={true}
                    data-cy="customer-billingAddress"
                    aria-label={formatMessage({
                        id: 'global.streetAddress1Required',
                        defaultMessage: 'Billing Address Required'
                    })}
                />
                </Field>
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
                <div className='grid grid-cols-3 gap-4'>
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
                id="zipCode"
                label={formatMessage({
                    id: 'createAccount.zipCodeText',
                    defaultMessage: 'Zip/Postal'
                })}
            >
                <TextInput
                    id="zipCode"
                    field="customer.zipCode"
                    autoComplete="given-name"
                    validate={isRequired}
                    isRequired={true}
                    validateOnBlur
                    mask={value => value && value.trim()}
                    maskOnBlur={true}
                    data-cy="customer-zipCode"
                    aria-label={formatMessage({
                        id: 'global.zipCodeRequired',
                        defaultMessage: 'Zip/Postal Required'
                    })}
                />
                </Field>
                </div>
                <Field
                id="accountsPaybleContactName"
                label={formatMessage({
                    id: 'createAccount.accountsPaybleContactNameText',
                    defaultMessage: 'Accounts Payble Contact Name'
                })}
            >
                <TextInput
                    id="accountsPaybleContactName"
                    field="customer.accountsPaybleContactName"
                    autoComplete="given-name"
                    validate={isRequired}
                    isRequired={true}
                    validateOnBlur
                    mask={value => value && value.trim()}
                    maskOnBlur={true}
                    data-cy="customer-accountsPaybleContactName"
                    aria-label={formatMessage({
                        id: 'global.accountsPaybleContactNameRequired',
                        defaultMessage: 'Accounts Payble Contact Name Required'
                    })}
                />
                </Field>
                <Field
                id="accountsPayblePhoneNumber"
                label={formatMessage({
                    id: 'createAccount.accountsPayblePhoneNumberText',
                    defaultMessage: 'Accounts Payble Phone Number'
                })}
            >
                <TextInput
                    id="accountsPayblePhoneNumber"
                    field="customer.accountsPayblePhoneNumber"
                    autoComplete="given-name"
                    validate={isRequired}
                    isRequired={true}
                    validateOnBlur
                    mask={value => value && value.trim()}
                    maskOnBlur={true}
                    data-cy="customer-accountsPayblePhoneNumber"
                    aria-label={formatMessage({
                        id: 'global.accountsPayblePhoneNumberRequired',
                        defaultMessage: 'Accounts Payble Phone Number Required'
                    })}
                />
                </Field>
                <Field
                id="accountsPaybleContactEmail"
                label={formatMessage({
                    id: 'createAccount.accountsPaybleContactEmailText',
                    defaultMessage: 'Accounts Payble Contact Email'
                })}
            >
                <TextInput
                    id="accountsPaybleContactEmail"
                    field="customer.accountsPaybleContactEmail"
                    autoComplete="given-name"
                    validate={isRequired}
                    isRequired={true}
                    validateOnBlur
                    mask={value => value && value.trim()}
                    maskOnBlur={true}
                    data-cy="customer-accountsPaybleContactEmail"
                    aria-label={formatMessage({
                        id: 'global.accountsPaybleContactEmailRequired',
                        defaultMessage: 'Accounts Payble Contact Email Required'
                    })}
                />
                </Field>
                <Field
                id="buyerContactName"
                label={formatMessage({
                    id: 'createAccount.buyerContactNameText',
                    defaultMessage: 'Buyer Contact Name'
                })}
            >
                <TextInput
                    id="buyerContactName"
                    field="customer.buyerContactName"
                    autoComplete="given-name"
                    validate={isRequired}
                    isRequired={true}
                    validateOnBlur
                    mask={value => value && value.trim()}
                    maskOnBlur={true}
                    data-cy="customer-buyerContactName"
                    aria-label={formatMessage({
                        id: 'global.buyerContactNameRequired',
                        defaultMessage: 'Buyer Contact Name Required'
                    })}
                />
                </Field>
                <Field
                id="buyerContactNumber"
                label={formatMessage({
                    id: 'createAccount.buyerContactNumberText',
                    defaultMessage: 'Buyer Contact Number'
                })}
            >
                <TextInput
                    id="buyerContactNumber"
                    field="customer.buyerContactNumber"
                    autoComplete="given-name"
                    validate={isRequired}
                    isRequired={true}
                    validateOnBlur
                    mask={value => value && value.trim()}
                    maskOnBlur={true}
                    data-cy="customer-buyerContactNumber"
                    aria-label={formatMessage({
                        id: 'global.buyerContactNumberRequired',
                        defaultMessage: 'Buyer Contact Number Required'
                    })}
                />
                </Field>
                <Field
                id="buyerContactEmail"
                label={formatMessage({
                    id: 'createAccount.buyerContactEmailText',
                    defaultMessage: 'Buyer Contact Email'
                })}
            >
                <TextInput
                    id="buyerContactEmail"
                    field="customer.buyerContactEmail"
                    autoComplete="given-name"
                    validate={isRequired}
                    isRequired={true}
                    validateOnBlur
                    mask={value => value && value.trim()}
                    maskOnBlur={true}
                    data-cy="customer-buyerContactEmail"
                    aria-label={formatMessage({
                        id: 'global.buyerContactEmailRequired',
                        defaultMessage: 'Buyer Contact Email Required'
                    })}
                />
                </Field>

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
                <div className='grid grid-cols-3 gap-4'>
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
                id="zipCode"
                label={formatMessage({
                    id: 'createAccount.zipCodeText',
                    defaultMessage: 'Zip/Postal'
                })}
            >
                <TextInput
                    id="zipCode"
                    field="customer.zipCode"
                    autoComplete="given-name"
                    validate={isRequired}
                    isRequired={true}
                    validateOnBlur
                    mask={value => value && value.trim()}
                    maskOnBlur={true}
                    data-cy="customer-zipCode"
                    aria-label={formatMessage({
                        id: 'global.zipCodeRequired',
                        defaultMessage: 'Zip/Postal Required'
                    })}
                />
                </Field>
                </div>
            {/* <h3>SIGN-IN INFORMATION</h3> */}
            {/* <div className='grid grid-cols-1 gap-y-4'>
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
            </div> */}
            </div>
            {/* <div className={classes.subscribe}>
                <Checkbox
                    field="subscribe"
                    id="subscribe"
                    label={formatMessage({
                        id: 'createAccount.subscribeText',
                        defaultMessage: 'Subscribe to news and updates'
                    })}
                />
            </div> */}
            </div>
            <p>By submitting this application, I, the undersigned, certify that all information on this application is accurate and true to the best of my knowledge.</p>
             <h3>Authorized Signature*</h3>
             <div className='grid grid-cols-2 gap-5'>
                <div >
                    <Field
                    id="sign"
                >
                    <TextInput
                        id="sign"
                        field="customer.sign"
                        autoComplete="given-name"
                        validate={isRequired}
                        isRequired={true}
                        validateOnBlur
                        mask={value => value && value.trim()}
                        maskOnBlur={true}
                        data-cy="customer-sign"
                        aria-label={formatMessage({
                            id: 'global.signRequired',
                            defaultMessage: 'Sign Required'
                        })}
                        placeholder="Sign"
                    />
                    </Field>
                </div>
                <Field
                    id="date"
                >
                    <TextInput
                        id="date"
                        field="customer.date"
                        autoComplete="given-name"
                        validate={isRequired}
                        isRequired={true}
                        validateOnBlur
                        mask={value => value && value.trim()}
                        maskOnBlur={true}
                        data-cy="customer-date"
                        aria-label={formatMessage({
                            id: 'global.dateRequired',
                            defaultMessage: 'Date Required'
                        })}
                    />
                    </Field>
            </div>   
            <GoogleRecaptcha {...recaptchaWidgetProps} />
            <div className={classes.actions}>
                {submitButton}
                {cancelButton}
            </div>
        </Form>
        </div>
        </div>
        {/* <div className='signin-right-container'>
            <img src={loginBg} width={100} height={100} className="w-full absolute top-0 left-0 h-full object-fit" />
            <div className='signin-image-container'>
                <img src={loginImage} width={460} height={519} className="w-full relative" />
                <h4>A leading supplier of apparel to the imprinted sportswear market</h4>
            </div>
        </div> */}
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
