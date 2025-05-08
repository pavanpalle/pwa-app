import { gql } from '@apollo/client';
import { GET_ORDER_PDF } from '../OrderHistoryPage/orderHistoryPage.gql';

export const GET_SALES_ORDERS_LIST = gql`
    query GetSalesOrdersList($OrderNo: String!) {
        # eslint-disable-next-line @graphql-eslint/require-id-when-available

        salesOrderDetail(OrderNo: $OrderNo) {
            Bill_to_Address
            Bill_to_City
            Bill_to_Contact
            Bill_to_Country_RegionCode
            Bill_to_County
            Bill_to_Customer_No
            Bill_to_Name
            Bill_to_PostCode
            External_Document_No
            No
            Order_Date
            Payment_Terms_Code
            Salesperson_Code
            Sell_to_City
            Ship_to_Address
            Ship_to_City
            Ship_to_Country_RegionCode
            Ship_to_County
            Ship_to_Name
            Ship_to_Name2
            Ship_to_PostCode
            Shipment_Date
            Shipping_Agent_Code
            Shipping_Agent_Service_Code
            lineItems {
                color
                description
                imageurl
                sizes {
                    Qty_Invoiced
                    Qty_Outstanding
                    Qty_Shipped
                    Quantity
                    size
                }
                style
                total_quantity
                unit_price
            }
        }
    }
`;

export default {
    getSalesOrderListQuery: GET_SALES_ORDERS_LIST,
    getOrderPdfQuery: GET_ORDER_PDF
};
