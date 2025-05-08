import React, { useRef } from 'react';
import * as ReactDOM from 'react-dom';
import JqxButton from 'jqwidgets-scripts/jqwidgets-react-tsx/jqxbuttons';
import JqxGrid, { jqx } from 'jqwidgets-scripts/jqwidgets-react-tsx/jqxgrid';
import JqxInput from 'jqwidgets-scripts/jqwidgets-react-tsx/jqxinput';

import 'jqwidgets-scripts/jqwidgets/styles/jqx.base.css';
import './jqx.boxer.css';
import pdfIcon from './pdf-file.png';
import viewIcon from './view-icon.png';
import { useHistory } from 'react-router-dom';
const JQGrid = (props = {}) => {
    const myGrid = useRef(null);
    const history = useHistory();
    const { data,handleDownloadPdf} = props;

    const source = {
        localData: data,
        datatype: 'array',
        datafields: [
            { name: 'NO', type: 'string' },
            { name: 'External_Document_No', type: 'string' },
            { name: 'Order_Date', type: 'date', cellsformat: 'yyyy-MM-dd' },
            { name: 'Ship_to_Name', type: 'string' },
            { name: 'Ship_to_Address', type: 'string' },
            { name: 'Ship_to_City', type: 'string' },
            { name: 'Ship_to_County', type: 'string' },
            { name: 'Status', type: 'string' },
            { name: 'View', type: 'button' },
            { name: 'Pdf', type: 'button' }
        ],
        record: 'NO',
        id: 'NO',
        async: true,
        totalrecords: data?.length || 0,
        //pagenum: currentPage - 1,
        pagesize: 10
    };

    const onClickView = () => {
        console.log('View clicked');
    };
    
    const dataAdapter = new jqx.dataAdapter(source);
    const columngroup = [{ text: 'Actions', align: 'center', name: 'Actions' }];
    const columns = [
        {
            text: 'ID No',
            datafield: 'NO',
            filtertype: 'input',
            width: 150,
            editable: false
        },
        {
            text: 'External Document No',
            datafield: 'External_Document_No',
            width: 250,
            filtertype: 'input',
            editable: false
        },
        {
            text: 'Order Date',
            datafield: 'Order_Date',
            width: 200,
            cellsformat: 'yyyy-MM-dd',
            filtertype: 'custom',
            editable: false,
            createfilterpanel: (datafield, filterPanel) => {
                buildFilterPanel(filterPanel, datafield);
            }
        },
        {
            text: 'Ship to Name',
            datafield: 'Ship_to_Name',
            width: 200,
            filtertype: 'input',
            editable: false
        },
        {
            text: 'Ship to Address',
            datafield: 'Ship_to_Address',
            width: 250,
            filtertype: 'input',
            editable: false
        },
        {
            text: 'Ship to City',
            datafield: 'Ship_to_City',
            width: 200,
            filtertype: 'input',
            editable: false
        },
        {
            text: 'Ship to State',
            datafield: 'Ship_to_County',
            width: 200,
            filtertype: 'input',
            editable: false
        },
        {
            text: 'Status',
            datafield: 'Status',
            width: 150,
            filtertype: 'input',
            editable: false
        },
        {
            text: '',
            datafield: 'View',
            // columngroup: 'Actions',
            columntype: 'button',
            width: 100,
            height: 100,
            editable: false,
            filterable: false,
            sortable: false,
            menu: false,
            // cellsrenderer: function() {
            //     return `<img alt="View" src='${viewIcon}' title="">`;

            // },
            cellsalign: 'center',
            cellsrenderer: function() {
                return 'View';
            },

            buttonclick: function(row) {
                if (data?.[row] === undefined || data?.[row] === null) return;
                const rowData = data[row];

                history.push(`/order-detail/${rowData?.NO}`);

                // history.push(`/order-detail`);
            }
        },
        {
            text: '',
            datafield: 'Pdf',
            // columngroup: 'Actions',
            columntype: 'button',
            width: 100,
            editable: false,
            filterable: false,
            sortable: false,
            menu: false,
            cellsrenderer: function() {
                return 'Pdf';
            },
            createWidget: function(row, column, value) {
                console.log("createWidget", row, column, value);
            },
            buttonclick: function(row) {
                if (data?.[row] === undefined || data?.[row] === null) return;
                const rowData = data[row];
                handleDownloadPdf(rowData?.NO)
            }
        }
    ];

    const buildFilterPanel = (filterPanel, datafield) => {
        const dataSource = {
            async: false,
            datatype: 'array',
            localdata: dataAdapter.records
        };
        const inputDataAdapter = new jqx.dataAdapter(dataSource, {
            async: false,
            autoBind: false,
            autoSort: true,
            autoSortField: datafield,
            uniqueDataFields: [datafield]
        });

        const filterButtonClick = () => {
            const filtervalue = myInput.current.getOptions('value');

            myGrid.current.closemenu();
            getAllArts(filtervalue, 'filter', 1, 10, datafield);
            setKeyword(filtervalue);
        };
        const filterClearButtonClick = () => {
            myGrid.current.closemenu();
            getAllArts('', 'clear', 1, 10);
            setKeyword('');
        };
        ReactDOM.render(
            <div>
                <JqxInput
                    ref={myInput}
                    style={{ margin: '5px' }}
                    width={175}
                    height={20}
                    source={inputDataAdapter}
                    displayMember={'datafield'}
                    popupZIndex={99999}
                    placeHolder={`Enter Text`}
                    val={keyword}
                />
                <div
                    style={{
                        height: '25px',
                        marginLeft: '20px',
                        marginTop: '7px'
                    }}
                >
                    <JqxButton
                        style={{ marginLeft: '16px', float: 'left' }}
                        onClick={filterButtonClick}
                        width={45}
                        height={25}
                        value={'Filter'}
                    />
                    <JqxButton
                        style={{ marginLeft: '12px', float: 'left' }}
                        onClick={filterClearButtonClick}
                        width={45}
                        height={25}
                        value={'Clear'}
                    />
                </div>
            </div>,
            filterPanel[0]
        );
    };

    const setFilterPlaceholders = () => {
        const columnPlaceholders = [
            'ID No',
            'External Document No',
            'Date',
            'Ship to Name',
            'Ship to Address',
            'Ship to City',
            'Ship to State',
            'Status'
        ];

        const filterInputs = document.querySelectorAll(
            '.jqx-grid-cell-filter-row input'
        );

        filterInputs.forEach(input => {
            const parentCell = input.closest('.jqx-grid-cell'); // or similar
            if (!parentCell) return;

            // Get index among sibling cells
            const cellIndex = Array.from(
                parentCell.parentElement.children
            ).indexOf(parentCell);

            if (cellIndex >= 0 && cellIndex < columnPlaceholders.length) {
                input.setAttribute(
                    'placeholder',
                    columnPlaceholders[cellIndex]
                );
            }
        });
    };
    const columnmenuopening = (menu, datafield, height) => {
        const column = myGrid.current.getcolumn(datafield);

        if (column.filtertype === 'custom') {
            menu.height(155);
            setTimeout(() => {
                menu.find('input').focus();
            }, 25);
        } else {
            menu.height(height);
        }
    };
    return (
        <div className="relative z-0">
            <JqxGrid
                ref={myGrid}
                width="100%"
                height={window.innerHeight * 0.5}
                source={dataAdapter}
                pageable={true}
                sortable={true}
                altrows={true}
                enabletooltips={true}
                autoheight={false}
                columnsresize={false}
                autorowheight={true}
                editable={true}
                scrollbarsize={10}
                scrollfeedback={true}
                scrollmode={'logical'}
                columns={columns}
                columngroups={columngroup}
                columnmenuopening={columnmenuopening}
                selectionmode={'multiplecellsadvanced'}
                theme={'boxer'}
                showfilterrow={true}
                filterable={true}
                columnsheight={72}
                rendered={setFilterPlaceholders}
            />

            {/* <JqxGrid
                ref={myGrid}
                width="100%"
                height={window.innerHeight*0.5}
                source={dataAdapter}
                columns={columns}
                pageable={true}
                autoheight={false}
                sortable={true}
                altrows={false}
                enabletooltips={true}
                editable={false}
                filterable={true}
                theme={"boxer"}
                columnmenuopening={columnmenuopening}
                //onFilter={myGridOnFilter}
                //onPagechanged={onPagechanged}
                columnsresize={true}
                autorowheight={false}
                columngroups={columngroup}
                // virtualmode={true}
                // rendergridrows={() => {
                //     return dataAdapter.records;
                // }
                // }
              
                rendered={setFilterPlaceholders}
                columnsheight={20}
                enablehover={false}
              /> */}
        </div>
    );
};

export default JQGrid;
