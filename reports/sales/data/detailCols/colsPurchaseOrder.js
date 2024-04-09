// This applies to all columns with acolType: 'purchaseOrder'

const purchaseOrderCols = async () => {
  return [
    // {
    //   unfilteredColIdx: 99, // index of col in original data GETS RENUMBERED ON INITIALIZATION OF SELECTOR
    //   displayName: 'No Cost', // show as column header
    //   dataName: 'no_cost_found', // key to pull data from
    //   justifyData: 'start', // css justify content
    //   justifyHeading: 'center', // css justify content
    //   width: '100px', // css width
    //   number: false, boolean: false, // flag to use formatTableData model
    //   date: false,
    //   decimals: 0, // if number is true, decimals will be used
    //   leftSticky: true, // css sticky
    //   left: '0px', // css positioning for sticky sum of prior col widths
    //   hidden: false, // flag to hide column.
    //   view: null, // dataset to show for the column (show by lbs, cost, revenue, margin, etc) based on option choosen (data must be set to true)
    //   data: false, // used in the main data, not the detail data. Used to toggle between different data types (lbs, cost, gm, rev , cogs) if true
    //   isDataDetailFmt: true, // for css styling in table.cell.styled
    //   searchable: true, // bool to determine if filter row will include a filter on this col
    //   searchValue: null, // placeholder for the search filter
    //   fraction: false, // flag that will indicate in both: applyItemGrouping and filteredDetailDataTotalsAtom selector to handle as a fraction
    //   fractionNumerator: null, // instructions for fraction calc
    //   fractionDenominator: null, // instruction for fraction calc
    //   groupBy: ['ungrouped'], // when grouping this array determines if this table col is included or filtered out.
    //   groupByIncrement: false, // if true this col will be reduced when grouping
    //   groupedLeftSticky: [], // cols are rearranged when group by is active put the group by col dataname in this array to left sticky this col in that group by
    //   colType: 'purchaseOrder', // corresponds to the colType in the non detail cols. This is used to determine which detail cols to use via storedDetailDataColsAtom
    //   defaultSort: false, // if true this col will be the default sort col
    // },

    {
      unfilteredColIdx: 99,
      displayName: 'Vendor',
      dataName: 'po_vendor',
      justifyData: 'start',
      justifyHeading: 'center',
      width: '100px',
      total: false, // if total is true this col will be reduced into the total row, if not it will be blank in the total row
      number: false,
      boolean: false,
      date: false,
      leftSticky: true,
      left: '0px',
      borderRight: false,
      hidden: false,
      view: null,
      data: false,
      isDataDetailFmt: true,
      searchable: true,
      searchValue: null,
      fraction: false,
      fractionNumerator: null,
      fractionDenominator: null,
      groupBy: ['po_number', 'po_vendor', 'ungrouped'],
      groupByIncrement: false,
      groupedLeftSticky: ['po_vendor'],
      colType: 'purchaseOrder',
      defaultSort: false,
    },
    {
      unfilteredColIdx: 99,
      displayName: 'Document',
      dataName: 'po_number',
      justifyData: 'start',
      justifyHeading: 'center',
      width: '100px',
      total: false,
      number: false,
      boolean: false,
      date: false,
      decimals: 0,
      leftSticky: true,
      left: '100px',
      borderRight: false,
      hidden: false,
      view: null,
      data: false,
      valueFallback: 0,
      isDataDetailFmt: true,
      searchable: true,
      searchValue: null,
      fraction: false,
      fractionNumerator: null,
      fractionDenominator: null,
      groupBy: ['po_number', 'ungrouped'],
      groupByIncrement: false,
      groupedLeftSticky: ['po_number', 'po_vendor'],
      colType: 'purchaseOrder',
      defaultSort: false,
    },
    {
      unfilteredColIdx: 99,
      displayName: 'Item',
      dataName: 'item_number',
      justifyData: 'start',
      justifyHeading: 'center',
      width: '100px',
      total: false,
      number: false,
      boolean: false,
      date: false,
      decimals: 0,
      leftSticky: true,
      left: '200px',
      borderRight: true,
      hidden: false,
      view: null,
      data: false,
      valueFallback: 0,
      isDataDetailFmt: true,
      searchable: true,
      searchValue: null,
      fraction: false,
      fractionNumerator: null,
      fractionDenominator: null,
      groupBy: ['item_number', 'ungrouped'],
      groupByIncrement: false,
      groupedLeftSticky: ['item_number', 'description'],
      colType: 'purchaseOrder',
      defaultSort: false,
    },
    {
      unfilteredColIdx: 99,
      displayName: 'Description',
      dataName: 'description',
      justifyData: 'start',
      justifyHeading: 'center',
      width: '225px',
      total: false,
      number: false,
      boolean: false,
      date: false,
      decimals: 0,
      leftSticky: false,
      left: '0px',
      borderRight: false,
      hidden: false,
      view: null,
      data: false,
      valueFallback: 0,
      isDataDetailFmt: true,
      searchable: true,
      searchValue: null,
      fraction: false,
      fractionNumerator: null,
      fractionDenominator: null,
      groupBy: ['item_number', 'ungrouped'],
      groupByIncrement: false,
      groupedLeftSticky: [],
      colType: 'purchaseOrder',
      defaultSort: false,
    },
    {
      unfilteredColIdx: 99,
      displayName: 'Lbs',
      dataName: 'on_order_lbs',
      justifyData: 'end',
      justifyHeading: 'center',
      width: '100px',
      total: true,
      number: true,
      boolean: false,
      date: false,
      decimals: 0,
      leftSticky: false,
      left: '0px',
      borderRight: false,
      hidden: false,
      view: null,
      data: false,
      isDataDetailFmt: true,
      searchable: false,
      searchValue: null,
      fraction: false,
      fractionNumerator: null,
      fractionDenominator: null,
      groupBy: [
        'fg_fresh_frozen',
        'fg_treatment',
        'size_name',
        'brand',
        'species',
        'item_number',
        'location_code',
        'eta_date',
        'po_number',
        'po_vendor',
        'ungrouped',
      ],
      groupByIncrement: true,
      groupedLeftSticky: [],
      colType: 'purchaseOrder',
      defaultSort: true,
    },
    {
      unfilteredColIdx: 99,
      displayName: 'Cost',
      dataName: 'on_order_extended',
      justifyData: 'end',
      justifyHeading: 'center',
      width: '100px',
      total: true,
      number: true,
      boolean: false,
      date: false,
      decimals: 0,
      leftSticky: false,
      left: '0px',
      borderRight: false,
      hidden: false,
      view: null,
      data: false,
      isDataDetailFmt: true,
      searchable: false,
      searchValue: null,
      fraction: false,
      fractionNumerator: null,
      fractionDenominator: null,
      groupBy: [
        'fg_fresh_frozen',
        'fg_treatment',
        'size_name',
        'brand',
        'species',
        'item_number',
        'location_code',
        'eta_date',
        'po_number',
        'po_vendor',
        'ungrouped',
      ],
      groupByIncrement: true,
      groupedLeftSticky: [],
      colType: 'purchaseOrder',
      defaultSort: false,
    },
    {
      unfilteredColIdx: 99,
      displayName: 'Cost/lb',
      dataName: 'cost_lb',
      justifyData: 'end',
      justifyHeading: 'center',
      width: '100px',
      total: false,
      number: true,
      boolean: false,
      date: false,
      decimals: 2,
      leftSticky: false,
      left: '0px',
      borderRight: false,
      hidden: false,
      view: null,
      data: false,
      isDataDetailFmt: true,
      searchable: false,
      searchValue: null,
      fraction: true,
      fractionNumerator: 'on_order_extended',
      fractionDenominator: 'on_order_lbs',
      groupBy: [
        'fg_fresh_frozen',
        'fg_treatment',
        'size_name',
        'brand',
        'species',
        'item_number',
        'location_code',
        'eta_date',
        'po_number',
        'po_vendor',
        'ungrouped',
      ],
      groupByIncrement: false,
      groupedLeftSticky: [],
      colType: 'purchaseOrder',
      defaultSort: false,
    },
    {
      unfilteredColIdx: 99,
      displayName: 'Eta Date',
      dataName: 'eta_date',
      justifyData: 'start',
      justifyHeading: 'center',
      width: '150px',
      total: false,
      number: false,
      boolean: false,
      date: true, // Need to change back end to have this in a date format
      leftSticky: false,
      left: '0px',
      borderRight: false,
      hidden: false,
      view: null,
      data: false,
      isDataDetailFmt: true,
      searchable: true,
      searchValue: null,
      fraction: false,
      fractionNumerator: null,
      fractionDenominator: null,
      groupBy: ['eta_date', 'po_number', 'ungrouped'],
      groupByIncrement: false,
      groupedLeftSticky: ['eta_date'],
      colType: 'purchaseOrder',
      defaultSort: false,
    },
    {
      unfilteredColIdx: 99,
      displayName: 'Location',
      dataName: 'location_code',
      justifyData: 'start',
      justifyHeading: 'center',
      width: '100px',
      total: false,
      number: false,
      boolean: false,
      date: false,
      decimals: 0,
      leftSticky: false,
      left: '0px',
      borderRight: false,
      hidden: false,
      view: null,
      data: false,
      valueFallback: 0,
      isDataDetailFmt: true,
      searchable: true,
      searchValue: null,
      fraction: false,
      fractionNumerator: null,
      fractionDenominator: null,
      groupBy: ['location_code', 'ungrouped'],
      groupByIncrement: false,
      groupedLeftSticky: ['location_code'],
      colType: 'purchaseOrder',
      defaultSort: false,
    },
    {
      unfilteredColIdx: 99,
      displayName: 'Country',
      dataName: 'location_country',
      justifyData: 'start',
      justifyHeading: 'center',
      width: '100px',
      total: false,
      number: false,
      boolean: false,
      date: false,
      decimals: 0,
      leftSticky: false,
      left: '0px',
      borderRight: false,
      hidden: false,
      view: null,
      data: false,
      valueFallback: 0,
      isDataDetailFmt: true,
      searchable: true,
      searchValue: null,
      fraction: false,
      fractionNumerator: null,
      fractionDenominator: null,
      groupBy: ['location_code', 'ungrouped'],
      groupByIncrement: false,
      groupedLeftSticky: [],
      colType: 'purchaseOrder',
      defaultSort: false,
    },
    {
      unfilteredColIdx: 99,
      displayName: 'Species',
      dataName: 'species',
      justifyData: 'start',
      justifyHeading: 'center',
      width: '130px',
      total: false,
      number: false,
      boolean: false,
      date: false,
      leftSticky: false,
      left: '0px',
      borderRight: false,
      hidden: false,
      view: null,
      data: false,
      isDataDetailFmt: true,
      searchable: true,
      searchValue: null,
      fraction: false,
      fractionNumerator: null,
      fractionDenominator: null,
      groupBy: ['species', 'item_number', 'ungrouped'],
      groupByIncrement: false,
      groupedLeftSticky: ['species'],
      colType: 'purchaseOrder',
      defaultSort: false,
    },
    {
      unfilteredColIdx: 99,
      displayName: 'Brand',
      dataName: 'brand',
      justifyData: 'start',
      justifyHeading: 'center',
      width: '150px',
      total: false,
      number: false,
      boolean: false,
      date: false,
      leftSticky: false,
      left: '0px',
      borderRight: false,
      hidden: false,
      view: null,
      data: false,
      isDataDetailFmt: true,
      searchable: true,
      searchValue: null,
      fraction: false,
      fractionNumerator: null,
      fractionDenominator: null,
      groupBy: ['brand', 'item_number', 'ungrouped'],
      groupByIncrement: false,
      groupedLeftSticky: ['brand'],
      colType: 'purchaseOrder',
      defaultSort: false,
    },
    {
      unfilteredColIdx: 99,
      displayName: 'Size',
      dataName: 'size_name',
      justifyData: 'start',
      justifyHeading: 'center',
      width: '100px',
      total: false,
      number: false,
      boolean: false,
      date: false,
      leftSticky: false,
      left: '0px',
      borderRight: false,
      hidden: false,
      view: null,
      data: false,
      isDataDetailFmt: true,
      searchable: true,
      searchValue: null,
      fraction: false,
      fractionNumerator: null,
      fractionDenominator: null,
      groupBy: ['size_name', 'item_number', 'ungrouped'],
      groupByIncrement: false,
      groupedLeftSticky: ['size_name'],
      colType: 'purchaseOrder',
      defaultSort: false,
    },
    {
      unfilteredColIdx: 99,
      displayName: 'Soak',
      dataName: 'fg_treatment',
      justifyData: 'start',
      justifyHeading: 'center',
      width: '100px',
      total: false,
      number: false,
      boolean: false,
      date: false,
      leftSticky: false,
      left: '0px',
      borderRight: false,
      hidden: false,
      view: null,
      data: false,
      isDataDetailFmt: true,
      searchable: true,
      searchValue: null,
      fraction: false,
      fractionNumerator: null,
      fractionDenominator: null,
      groupBy: ['fg_treatment', 'item_number', 'ungrouped'],
      groupByIncrement: false,
      groupedLeftSticky: ['fg_treatment'],
      colType: 'purchaseOrder',
      defaultSort: false,
    },
    {
      unfilteredColIdx: 99,
      displayName: 'Freeze',
      dataName: 'fg_fresh_frozen',
      justifyData: 'start',
      justifyHeading: 'center',
      width: '100px',
      total: false,
      number: false,
      boolean: false,
      date: false,
      leftSticky: false,
      left: '0px',
      borderRight: false,
      hidden: false,
      view: null,
      data: false,
      isDataDetailFmt: true,
      searchable: true,
      searchValue: null,
      fraction: false,
      fractionNumerator: null,
      fractionDenominator: null,
      groupBy: ['fg_fresh_frozen', 'item_number', 'ungrouped'],
      groupByIncrement: false,
      groupedLeftSticky: ['fg_fresh_frozen'],
      colType: 'purchaseOrder',
      defaultSort: false,
    },
  ]
}

module.exports = purchaseOrderCols
