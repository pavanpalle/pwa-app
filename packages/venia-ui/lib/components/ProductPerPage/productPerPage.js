import { array, arrayOf, shape, string } from 'prop-types';
import { useIntl } from 'react-intl';
import React from 'react';
import { useStyle } from '../../classify';
import defaultClasses from './productPerPage.module.css';
import { Form } from 'informed';
import Select from '../Select';

const PAGE_SIZE_OPTIONS = [
    { value: '24', label: '24' },
    { value: '36', label: '36' },
    { value: '48', label: '48' }
];

const ProductPerPage = props => {
    const classes = useStyle(defaultClasses, props.classes);
   
   
    const { formatMessage } = useIntl();

   const handleSubmit = event => {
       // setProductsPerPage(event.target.value);
    };

    return (
        <div
         
            className={classes.root}
            data-cy="ProductsPerPage-root"
            aria-busy="false"
        >
           
                           
                       <Form
                           initialValues={{ products_per_page: 24 }}
                           onSubmit={handleSubmit}
                           autoComplete="off"
                       >
                                   <Select
                                       field="products_per_page"
                                      
                                       items={PAGE_SIZE_OPTIONS}
                                       onSelectionChange={handleSubmit}
                                        selectedValue={String(24)}
                                       label={formatMessage({
                                           id: 'productsPerPage.label',
                                           defaultMessage: 'Per page'
                                       })}
                                       data-cy="ProductsPerPage-select"
                                   />
                       </Form>
                       </div>
       
    );
};

ProductPerPage.propTypes = {
    classes: shape({
        menuItem: string,
        menu: string,
        root: string,
        sortButton: string
    }),
    availableSortMethods: arrayOf(
        shape({
            label: string,
            value: string
        })
    ),
    sortProps: array
};

export default ProductPerPage;
