import React, { useEffect } from 'react';
import JqxGrid, { jqx } from "jqwidgets-scripts/jqwidgets-react-tsx/jqxgrid"
// import 'jqwidgets-scripts/jqwidgets/styles/jqx.base.css';
import viewIcon from './view-icon.png';
import pdfIcon from './pdf-file.png';

const JQGrid = () => {
    const source = {
        localdata: [
            { id: 'INV885159', document: 'DECORATED SI SAMPLES', order_date: '2024-05-22', ship_name: 'DON BELL', ship_address: '7131 Discovery Blvd Mableton GA 30126 USA', ship_city:'Mableton', ship_state:'Georgia', status:'<div class=invoiced>Invoiced</div>', view: '<img src="view-icon.png" width={24} height={24} />', pdf:'' },
            { id: 'INV885159', document: 'DECORATED SI SAMPLES', order_date: '2024-05-22', ship_name: 'DON BELL', ship_address: `7131 Discovery Blvd 
            Mableton GA 30126 USA`, ship_city:'Mableton', ship_state:'Georgia', status:'<div class=invoiced>Invoiced</div>', view:'', pdf:'' },
            { id: 'INV885159', document: 'DECORATED SI SAMPLES', order_date: '2024-05-22', ship_name: 'DON BELL', ship_address: `7131 Discovery Blvd 
            Mableton GA 30126 USA`, ship_city:'Mableton', ship_state:'Georgia', status:'<div class=inprogress>Inprogress</div>', view:'', pdf:'' },
            { id: 'INV885159', document: 'DECORATED SI SAMPLES', order_date: '2024-05-22', ship_name: 'DON BELL', ship_address: `7131 Discovery Blvd 
            Mableton GA 30126 USA`, ship_city:'Mableton', ship_state:'Georgia', status:'<div class=invoiced>Invoiced</div>', view:'', pdf:'' },
            { id: 'INV885159', document: 'DECORATED SI SAMPLES', order_date: '2024-05-22', ship_name: 'DON BELL', ship_address: `7131 Discovery Blvd 
            Mableton GA 30126 USA`, ship_city:'Mableton', ship_state:'Georgia', status:'<div class=invoiced>Invoiced</div>', view:'', pdf:'' },
            { id: 'INV885159', document: 'DECORATED SI SAMPLES', order_date: '2024-05-22', ship_name: 'DON BELL', ship_address: `7131 Discovery Blvd 
            Mableton GA 30126 USA`, ship_city:'Mableton', ship_state:'Georgia', status:'<div class=cancelled>Cancelled</div>', view:'', pdf:'' },
            { id: 'INV885159', document: 'DECORATED SI SAMPLES', order_date: '2024-05-22', ship_name: 'DON BELL', ship_address: `7131 Discovery Blvd 
             Mableton GA 30126 USA`, ship_city:'Mableton', ship_state:'Georgia', status:'<div class=invoiced>Invoiced</div>', view:'', pdf:'' },
            { id: 'INV885159', document: 'DECORATED SI SAMPLES', order_date: '2024-05-22', ship_name: 'DON BELL', ship_address: `7131 Discovery Blvd 
              Mableton GA 30126 USA`, ship_city:'Mableton', ship_state:'Georgia', status:'<div class=invoiced>Invoiced</div>', view:'', pdf:'' },
            { id: 'INV885159', document: 'DECORATED SI SAMPLES', order_date: '2024-05-22', ship_name: 'DON BELL', ship_address: `7131 Discovery Blvd 
                Mableton GA 30126 USA`, ship_city:'Mableton', ship_state:'Georgia', status:'<div class=inprogress>Inprogress</div>', view:'', pdf:'' },
            { id: 'INV885159', document: 'DECORATED SI SAMPLES', order_date: '2024-05-22', ship_name: 'DON BELL', ship_address: `7131 Discovery Blvd 
                    Mableton GA 30126 USA`, ship_city:'Mableton', ship_state:'Georgia', status:'<div class=invoiced>Invoiced</div>', view:'', pdf:'' },            
        ],
        datatype: 'array',
        datafields: [
            { name: 'id', type: 'string' },
            { name: 'document', type: 'string' },
            { name: 'order_date', type: 'string' },
            { name: 'ship_name', type: 'string' },
            { name: 'ship_address', type: 'string' },
            { name: 'ship_city', type: 'string' },
            { name: 'ship_state', type: 'string' },
            { name: 'status', type: 'string' },
            { name: 'view', type: 'string' },
            { name: 'pdf', type: 'string' },
        ]
    };

    const dataAdapter = new window.jqx.dataAdapter(source);

    return (
        <div className='relative z-0'>
            {/* <h2>JQWidgets Grid in PWA Studio</h2> */}
            {/* <JqxGrid
                width={600}
                source={dataAdapter}
                columns={[
                    { text: 'First Name', datafield: 'firstname', width: 200 },
                    { text: 'Last Name', datafield: 'lastname', width: 200 },
                    { text: 'Age', datafield: 'age', width: 200 }
                ]}
            /> */}
            <JqxGrid
            width={window.innerWidth*0.95}
            height={window.innerHeight*0.5}
              source={dataAdapter}
              pageable={true}
              sortable={true}
              altrows={true}
              enabletooltips={true}
              autoheight={false}
              columnsresize={false}
              autorowheight={true}
              editable={true}
              columns={[
                { text: 'ID No', datafield: 'id', width: 150 },
                { text: 'External Document No', datafield: 'document', width: 250 },
                { text: 'Order Date', datafield: 'order_date', width: 200 },
                { text: 'Ship to Name', datafield: 'ship_name', width: 200 },
                { text: 'Ship to Address', datafield: 'ship_address', width: 250 },
                { text: 'Ship to City', datafield: 'ship_city', width: 200 },
                { text: 'Ship to State', datafield: 'ship_state', width: 200 },
                { text: 'Status', datafield: 'status', width: 150 },
                { text: 'View', datafield: 'view', width: 100, editable: false, cellsrenderer:function(value){return `<img alt="View" src='${viewIcon}' title="">`}},
                { text: 'PDF', datafield: 'pdf', width: 100, editable: false, cellsrenderer:function(value){return `<img alt="Pdf" src='${pdfIcon}' title="">`} },
            ]}
            //   columns={columns}
              selectionmode={"multiplecellsadvanced"}
              theme={"boxer"}
              showfilterrow={true}
              filterable={true}
              columnsheight={72}
            />
        </div>
    );
};

export default JQGrid;
