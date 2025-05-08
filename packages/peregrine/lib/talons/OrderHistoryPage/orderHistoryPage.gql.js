import { gql } from '@apollo/client';

const CustomerOrdersFragment = gql`
    fragment CustomerOrdersFragment on CustomerOrders {
        items {
            billing_address {
                city
                country_code
                firstname
                lastname
                postcode
                region
                street
                telephone
            }
            id
            invoices {
                id
            }
            items {
                id
                product_name
                product_sale_price {
                    currency
                    value
                }
                product_sku
                product_url_key
                selected_options {
                    label
                    value
                }
                quantity_ordered
            }
            number
            order_date
            payment_methods {
                name
                type
                additional_data {
                    name
                    value
                }
            }
            shipments {
                id
                tracking {
                    number
                }
            }
            shipping_address {
                city
                country_code
                firstname
                lastname
                postcode
                region
                street
                telephone
            }
            shipping_method
            status

            total {
                discounts {
                    amount {
                        currency
                        value
                    }
                }
                grand_total {
                    currency
                    value
                }
                subtotal {
                    currency
                    value
                }
                total_shipping {
                    currency
                    value
                }
                total_tax {
                    currency
                    value
                }
            }
        }
        page_info {
            current_page
            total_pages
        }
        total_count
    }
`;

export const GET_CUSTOMER_ORDERS = gql`
    query GetCustomerOrders(
        $filter: CustomerOrdersFilterInput
        $pageSize: Int!
    ) {
        # eslint-disable-next-line @graphql-eslint/require-id-when-available
        customer {
            orders(filter: $filter, pageSize: $pageSize) {
                ...CustomerOrdersFragment
            }
        }
    }
    ${CustomerOrdersFragment}
`;

export const GET_SALES_ORDERS_LIST = gql`
    query GetSalesOrdersList(
        $filter: SalesOrdersFilterInput
        $pageSize: Int!
        $currentPage: Int!
    ) {
        # eslint-disable-next-line @graphql-eslint/require-id-when-available

        salesOrdersList(
            filter: $filter
            pageSize: $pageSize
            currentPage: $currentPage
        ) {
            items {
                External_Document_No
                NO
                Order_Date
                Ship_to_Address
                Ship_to_City
                Ship_to_County
                Ship_to_Name
                Status
            }
            total_count
        }
    }
    
`;

export const GET_ORDER_PDF = gql`
    query GetOrderPdf(
       
        $OrderNo: String!
    ) {
        # eslint-disable-next-line @graphql-eslint/require-id-when-available

        orderPdf(
           
            OrderNo: $OrderNo
        ) {
            pdfData
           
        }
    }
    
`;

export default {
    getCustomerOrdersQuery: GET_CUSTOMER_ORDERS,
    getSalesOrderListQuery: GET_SALES_ORDERS_LIST,
    getOrderPdfQuery: GET_ORDER_PDF
};
