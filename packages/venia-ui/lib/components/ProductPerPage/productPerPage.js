import { array, arrayOf, shape, string } from 'prop-types';
import { useIntl } from 'react-intl';
import React from 'react';
import { useStyle } from '../../classify';
import defaultClasses from './productPerPage.module.css';
import { Form } from 'informed';
import Select from '../Select';
import { useProductPerPage } from '@magento/peregrine/lib/talons/ProductPerPage';


const ProductPerPage = props => {
    const classes = useStyle(defaultClasses, props.classes);

    const {total_count,pageSize,setPageSize} = props;

    const {
        
        initialValues,
        options,
        handleSubmit,
        handleSelectionChange
    } = useProductPerPage({ total_count,pageSize,setPageSize });

    const { formatMessage } = useIntl();

    return (
        <div
            className={classes.root}
            data-cy="ProductsPerPage-root"
            aria-busy="false"
        >
            <Form onSubmit={handleSubmit}>
                <Select
                    field="product_list_limit"
                    items={options}
                    onValueChange={handleSelectionChange}
                    initialValue={initialValues.product_list_limit} 
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
