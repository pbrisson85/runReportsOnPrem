// This applies to all columns with a colType: 'salesOrder'

const workOrderCols = [
  {
    unfilteredColIdx: 99,
    displayName: 'Work Order',
    dataName: 'wo_num',
    justifyData: 'start',
    justifyHeading: 'center',
    width: '50px',
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
    groupBy: ['ungrouped', 'wo_num'], // when grouping this array determines if this table col is included or filtered out.
    groupByIncrement: false,
    groupedLeftSticky: ['ungrouped', 'wo_num'],
    colType: 'wo',
    defaultSort: false,
  },
  {
    unfilteredColIdx: 99,
    displayName: 'Activity',
    dataName: 'wo_activity',
    justifyData: 'start',
    justifyHeading: 'center',
    width: '75px',
    total: false, // if total is true this col will be reduced into the total row, if not it will be blank in the total row
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
    groupBy: ['ungrouped', 'wo_num'], // when grouping this array determines if this table col is included or filtered out.
    groupByIncrement: false,
    groupedLeftSticky: [],
    colType: 'wo',
    defaultSort: false,
  },
  {
    unfilteredColIdx: 99,
    displayName: 'Production Code',
    dataName: 'wo_activity_code',
    justifyData: 'start',
    justifyHeading: 'center',
    width: '100px',
    total: false, // if total is true this col will be reduced into the total row, if not it will be blank in the total row
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
    groupBy: ['ungrouped', 'wo_num'], // when grouping this array determines if this table col is included or filtered out.
    groupByIncrement: false,
    groupedLeftSticky: [],
    colType: 'wo',
    defaultSort: false,
  },
  {
    unfilteredColIdx: 99,
    displayName: 'Entity',
    dataName: 'entity',
    justifyData: 'start',
    justifyHeading: 'center',
    width: '100px',
    total: false, // if total is true this col will be reduced into the total row, if not it will be blank in the total row
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
    groupBy: ['ungrouped', 'wo_num', 'entity'], // when grouping this array determines if this table col is included or filtered out.
    groupByIncrement: false,
    groupedLeftSticky: ['entity'],
    colType: 'wo',
    defaultSort: false,
  },
  {
    unfilteredColIdx: 99,
    displayName: 'Country',
    dataName: 'country',
    justifyData: 'start',
    justifyHeading: 'center',
    width: '100px',
    total: false, // if total is true this col will be reduced into the total row, if not it will be blank in the total row
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
    groupBy: ['ungrouped', 'wo_num', 'entity', 'country'], // when grouping this array determines if this table col is included or filtered out.
    groupByIncrement: false,
    groupedLeftSticky: ['country'],
    colType: 'wo',
    defaultSort: false,
  },
  {
    unfilteredColIdx: 99,
    displayName: 'Item',
    dataName: 'item',
    justifyData: 'start',
    justifyHeading: 'center',
    width: '100px',
    total: false, // if total is true this col will be reduced into the total row, if not it will be blank in the total row
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
    groupBy: ['ungrouped', 'item'], // when grouping this array determines if this table col is included or filtered out.
    groupByIncrement: false,
    groupedLeftSticky: ['item'],
    colType: 'wo',
    defaultSort: false,
  },
  {
    unfilteredColIdx: 99,
    displayName: 'Description',
    dataName: 'description',
    justifyData: 'start',
    justifyHeading: 'center',
    width: '100px',
    total: false, // if total is true this col will be reduced into the total row, if not it will be blank in the total row
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
    groupBy: ['ungrouped', 'item'], // when grouping this array determines if this table col is included or filtered out.
    groupByIncrement: false,
    groupedLeftSticky: [],
    colType: 'wo',
    defaultSort: false,
  },
  {
    unfilteredColIdx: 99,
    displayName: 'Lot text',
    dataName: 'lot_text',
    justifyData: 'start',
    justifyHeading: 'center',
    width: '100px',
    total: false, // if total is true this col will be reduced into the total row, if not it will be blank in the total row
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
    groupBy: ['ungrouped'], // when grouping this array determines if this table col is included or filtered out.
    groupByIncrement: false,
    groupedLeftSticky: [],
    colType: 'wo',
    defaultSort: false,
  },
  {
    unfilteredColIdx: 99,
    displayName: 'Location',
    dataName: 'location',
    justifyData: 'start',
    justifyHeading: 'center',
    width: '100px',
    total: false, // if total is true this col will be reduced into the total row, if not it will be blank in the total row
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
    groupBy: ['ungrouped', 'wo_num'], // when grouping this array determines if this table col is included or filtered out.
    groupByIncrement: false,
    groupedLeftSticky: [],
    colType: 'wo',
    defaultSort: false,
  },
  {
    unfilteredColIdx: 99,
    displayName: 'Classification',
    dataName: 'classification',
    justifyData: 'start',
    justifyHeading: 'center',
    width: '100px',
    total: false, // if total is true this col will be reduced into the total row, if not it will be blank in the total row
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
    groupBy: ['ungrouped', 'wo_num', 'classification'], // when grouping this array determines if this table col is included or filtered out.
    groupByIncrement: false,
    groupedLeftSticky: ['classification'],
    colType: 'wo',
    defaultSort: false,
  },
  {
    unfilteredColIdx: 99,
    displayName: 'Notes',
    dataName: 'notes',
    justifyData: 'start',
    justifyHeading: 'center',
    width: '100px',
    total: false, // if total is true this col will be reduced into the total row, if not it will be blank in the total row
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
    groupBy: ['ungrouped', 'wo_num'], // when grouping this array determines if this table col is included or filtered out.
    groupByIncrement: false,
    groupedLeftSticky: [],
    colType: 'wo',
    defaultSort: false,
  },
  {
    unfilteredColIdx: 99,
    displayName: 'Lot',
    dataName: 'lot',
    justifyData: 'start',
    justifyHeading: 'center',
    width: '100px',
    total: false, // if total is true this col will be reduced into the total row, if not it will be blank in the total row
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
    groupBy: ['ungrouped', 'wo_num'], // when grouping this array determines if this table col is included or filtered out.
    groupByIncrement: false,
    groupedLeftSticky: [],
    colType: 'wo',
    defaultSort: false,
  },
  {
    unfilteredColIdx: 99,
    displayName: 'Date',
    dataName: 'posting_date',
    justifyData: 'start',
    justifyHeading: 'center',
    width: '100px',
    total: false, // if total is true this col will be reduced into the total row, if not it will be blank in the total row
    number: false,
    boolean: false,
    date: true,
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
    groupBy: ['ungrouped', 'wo_num', 'posting_date'], // when grouping this array determines if this table col is included or filtered out.
    groupByIncrement: false,
    groupedLeftSticky: ['posting_date'],
    colType: 'wo',
    defaultSort: false,
  },
  {
    unfilteredColIdx: 99,
    displayName: 'FG Lbs',
    dataName: 'lbs',
    justifyData: 'start',
    justifyHeading: 'center',
    width: '100px',
    total: true, // if total is true this col will be reduced into the total row, if not it will be blank in the total row
    number: true,
    boolean: false,
    date: false,
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
      'ungrouped',
      'wo_num',
      'posting_date',
      'classification',
      'item',
      'entity',
      'country',
      'species',
      'brand',
      'size',
      'soak',
      'fresh_frozen',
    ], // when grouping this array determines if this table col is included or filtered out.
    groupByIncrement: false,
    groupedLeftSticky: [],
    colType: 'wo',
    defaultSort: true,
  },
  {
    unfilteredColIdx: 99,
    displayName: 'RM Lbs',
    dataName: 'rm_lbs',
    justifyData: 'start',
    justifyHeading: 'center',
    width: '100px',
    total: true, // if total is true this col will be reduced into the total row, if not it will be blank in the total row
    number: true,
    boolean: false,
    date: false,
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
      'ungrouped',
      'wo_num',
      'posting_date',
      'classification',
      'item',
      'entity',
      'country',
      'species',
      'brand',
      'size',
      'soak',
      'fresh_frozen',
    ], // when grouping this array determines if this table col is included or filtered out.
    groupByIncrement: false,
    groupedLeftSticky: [],
    colType: 'wo',
    defaultSort: false,
  },
  {
    unfilteredColIdx: 99,
    displayName: 'Cost',
    dataName: 'cost',
    justifyData: 'start',
    justifyHeading: 'center',
    width: '100px',
    total: true, // if total is true this col will be reduced into the total row, if not it will be blank in the total row
    number: true,
    boolean: false,
    date: false,
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
      'ungrouped',
      'wo_num',
      'posting_date',
      'classification',
      'item',
      'entity',
      'country',
      'species',
      'brand',
      'size',
      'soak',
      'fresh_frozen',
    ], // when grouping this array determines if this table col is included or filtered out.
    groupByIncrement: false,
    groupedLeftSticky: [],
    colType: 'wo',
    defaultSort: false,
  },
  {
    unfilteredColIdx: 99,
    displayName: 'Labor',
    dataName: 'labor',
    justifyData: 'start',
    justifyHeading: 'center',
    width: '100px',
    total: true, // if total is true this col will be reduced into the total row, if not it will be blank in the total row
    number: true,
    boolean: false,
    date: false,
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
      'ungrouped',
      'wo_num',
      'posting_date',
      'classification',
      'item',
      'entity',
      'country',
      'species',
      'brand',
      'size',
      'soak',
      'fresh_frozen',
    ], // when grouping this array determines if this table col is included or filtered out.
    groupByIncrement: false,
    groupedLeftSticky: [],
    colType: 'wo',
    defaultSort: false,
  },
  {
    unfilteredColIdx: 99,
    displayName: 'OH',
    dataName: 'oh',
    justifyData: 'start',
    justifyHeading: 'center',
    width: '100px',
    total: true, // if total is true this col will be reduced into the total row, if not it will be blank in the total row
    number: true,
    boolean: false,
    date: false,
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
      'ungrouped',
      'wo_num',
      'posting_date',
      'classification',
      'item',
      'entity',
      'country',
      'species',
      'brand',
      'size',
      'soak',
      'fresh_frozen',
    ], // when grouping this array determines if this table col is included or filtered out.
    groupByIncrement: false,
    groupedLeftSticky: [],
    colType: 'wo',
    defaultSort: false,
  },
  {
    unfilteredColIdx: 99,
    displayName: 'Packaging',
    dataName: 'packaging',
    justifyData: 'start',
    justifyHeading: 'center',
    width: '100px',
    total: true, // if total is true this col will be reduced into the total row, if not it will be blank in the total row
    number: true,
    boolean: false,
    date: false,
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
      'ungrouped',
      'wo_num',
      'posting_date',
      'classification',
      'item',
      'entity',
      'country',
      'species',
      'brand',
      'size',
      'soak',
      'fresh_frozen',
    ], // when grouping this array determines if this table col is included or filtered out.
    groupByIncrement: false,
    groupedLeftSticky: [],
    colType: 'wo',
    defaultSort: false,
  },
  {
    unfilteredColIdx: 99,
    displayName: 'Chem',
    dataName: 'chem',
    justifyData: 'start',
    justifyHeading: 'center',
    width: '100px',
    total: true, // if total is true this col will be reduced into the total row, if not it will be blank in the total row
    number: true,
    boolean: false,
    date: false,
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
      'ungrouped',
      'wo_num',
      'posting_date',
      'classification',
      'item',
      'entity',
      'country',
      'species',
      'brand',
      'size',
      'soak',
      'fresh_frozen',
    ], // when grouping this array determines if this table col is included or filtered out.
    groupByIncrement: false,
    groupedLeftSticky: [],
    colType: 'wo',
    defaultSort: false,
  },
  {
    unfilteredColIdx: 99,
    displayName: 'Processing Fee',
    dataName: 'processingFee',
    justifyData: 'start',
    justifyHeading: 'center',
    width: '100px',
    total: true, // if total is true this col will be reduced into the total row, if not it will be blank in the total row
    number: true,
    boolean: false,
    date: false,
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
      'ungrouped',
      'wo_num',
      'posting_date',
      'classification',
      'item',
      'entity',
      'country',
      'species',
      'brand',
      'size',
      'soak',
      'fresh_frozen',
    ], // when grouping this array determines if this table col is included or filtered out.
    groupByIncrement: false,
    groupedLeftSticky: [],
    colType: 'wo',
    defaultSort: false,
  },
  {
    unfilteredColIdx: 99,
    displayName: 'Yield',
    dataName: 'yield',
    justifyData: 'start',
    justifyHeading: 'center',
    width: '100px',
    total: true, // if total is true this col will be reduced into the total row, if not it will be blank in the total row
    number: true,
    boolean: false,
    date: false,
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
    fractionNumerator: 'lbs',
    fractionDenominator: 'rm_lbs',
    groupBy: [
      'ungrouped',
      'wo_num',
      'posting_date',
      'classification',
      'item',
      'entity',
      'country',
      'species',
      'brand',
      'size',
      'soak',
      'fresh_frozen',
    ], // when grouping this array determines if this table col is included or filtered out.
    groupByIncrement: false,
    groupedLeftSticky: [],
    colType: 'wo',
    defaultSort: false,
  },
  {
    unfilteredColIdx: 99,
    displayName: 'FG $/Lb',
    dataName: 'costPerLb',
    justifyData: 'start',
    justifyHeading: 'center',
    width: '100px',
    total: true, // if total is true this col will be reduced into the total row, if not it will be blank in the total row
    number: true,
    boolean: false,
    date: false,
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
    fractionNumerator: 'cost',
    fractionDenominator: 'lbs',
    groupBy: [
      'ungrouped',
      'wo_num',
      'posting_date',
      'classification',
      'item',
      'entity',
      'country',
      'species',
      'brand',
      'size',
      'soak',
      'fresh_frozen',
    ], // when grouping this array determines if this table col is included or filtered out.
    groupByIncrement: false,
    groupedLeftSticky: [],
    colType: 'wo',
    defaultSort: false,
  },
  {
    unfilteredColIdx: 99,
    displayName: 'Labor $/Lb',
    dataName: 'laborPerLb',
    justifyData: 'start',
    justifyHeading: 'center',
    width: '100px',
    total: true, // if total is true this col will be reduced into the total row, if not it will be blank in the total row
    number: true,
    boolean: false,
    date: false,
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
    fractionNumerator: 'labor',
    fractionDenominator: 'lbs',
    groupBy: [
      'ungrouped',
      'wo_num',
      'posting_date',
      'classification',
      'item',
      'entity',
      'country',
      'species',
      'brand',
      'size',
      'soak',
      'fresh_frozen',
    ], // when grouping this array determines if this table col is included or filtered out.
    groupByIncrement: false,
    groupedLeftSticky: [],
    colType: 'wo',
    defaultSort: false,
  },
  {
    unfilteredColIdx: 99,
    displayName: 'OH $/Lb',
    dataName: 'ohPerLb',
    justifyData: 'start',
    justifyHeading: 'center',
    width: '100px',
    total: true, // if total is true this col will be reduced into the total row, if not it will be blank in the total row
    number: true,
    boolean: false,
    date: false,
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
    fractionNumerator: 'oh',
    fractionDenominator: 'lbs',
    groupBy: [
      'ungrouped',
      'wo_num',
      'posting_date',
      'classification',
      'item',
      'entity',
      'country',
      'species',
      'brand',
      'size',
      'soak',
      'fresh_frozen',
    ], // when grouping this array determines if this table col is included or filtered out.
    groupByIncrement: false,
    groupedLeftSticky: [],
    colType: 'wo',
    defaultSort: false,
  },
  {
    unfilteredColIdx: 99,
    displayName: 'PKG $/Lb',
    dataName: 'packagingPerLb',
    justifyData: 'start',
    justifyHeading: 'center',
    width: '100px',
    total: true, // if total is true this col will be reduced into the total row, if not it will be blank in the total row
    number: true,
    boolean: false,
    date: false,
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
    fractionNumerator: 'packaging',
    fractionDenominator: 'lbs',
    groupBy: [
      'ungrouped',
      'wo_num',
      'posting_date',
      'classification',
      'item',
      'entity',
      'country',
      'species',
      'brand',
      'size',
      'soak',
      'fresh_frozen',
    ], // when grouping this array determines if this table col is included or filtered out.
    groupByIncrement: false,
    groupedLeftSticky: [],
    colType: 'wo',
    defaultSort: false,
  },
  {
    unfilteredColIdx: 99,
    displayName: 'Chem $/Lb',
    dataName: 'chemPerLb',
    justifyData: 'start',
    justifyHeading: 'center',
    width: '100px',
    total: true, // if total is true this col will be reduced into the total row, if not it will be blank in the total row
    number: true,
    boolean: false,
    date: false,
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
    fractionNumerator: 'chem',
    fractionDenominator: 'lbs',
    groupBy: [
      'ungrouped',
      'wo_num',
      'posting_date',
      'classification',
      'item',
      'entity',
      'country',
      'species',
      'brand',
      'size',
      'soak',
      'fresh_frozen',
    ], // when grouping this array determines if this table col is included or filtered out.
    groupByIncrement: false,
    groupedLeftSticky: [],
    colType: 'wo',
    defaultSort: false,
  },
  {
    unfilteredColIdx: 99,
    displayName: 'Proc Fee $/Lb',
    dataName: 'processingFeePerLb',
    justifyData: 'start',
    justifyHeading: 'center',
    width: '100px',
    total: true, // if total is true this col will be reduced into the total row, if not it will be blank in the total row
    number: true,
    boolean: false,
    date: false,
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
    fractionNumerator: 'processingFee',
    fractionDenominator: 'lbs',
    groupBy: [
      'ungrouped',
      'wo_num',
      'posting_date',
      'classification',
      'item',
      'entity',
      'country',
      'species',
      'brand',
      'size',
      'soak',
      'fresh_frozen',
    ], // when grouping this array determines if this table col is included or filtered out.
    groupByIncrement: false,
    groupedLeftSticky: [],
    colType: 'wo',
    defaultSort: false,
  },
  {
    unfilteredColIdx: 99,
    displayName: 'Species',
    dataName: 'species',
    justifyData: 'start',
    justifyHeading: 'center',
    width: '75px',
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
    groupBy: ['ungrouped', 'item', 'species'], // when grouping this array determines if this table col is included or filtered out.
    groupByIncrement: false,
    groupedLeftSticky: ['species'],
    colType: 'wo',
    defaultSort: false,
  },
  {
    unfilteredColIdx: 99,
    displayName: 'Brand',
    dataName: 'brand',
    justifyData: 'start',
    justifyHeading: 'center',
    width: '75px',
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
    groupBy: ['ungrouped', 'item', 'brand'], // when grouping this array determines if this table col is included or filtered out.
    groupByIncrement: false,
    groupedLeftSticky: ['brand'],
    colType: 'wo',
    defaultSort: false,
  },
  {
    unfilteredColIdx: 99,
    displayName: 'Size',
    dataName: 'size',
    justifyData: 'start',
    justifyHeading: 'center',
    width: '75px',
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
    groupBy: ['ungrouped', 'item', 'size'], // when grouping this array determines if this table col is included or filtered out.
    groupByIncrement: false,
    groupedLeftSticky: ['size'],
    colType: 'wo',
    defaultSort: false,
  },
  {
    unfilteredColIdx: 99,
    displayName: 'Soak',
    dataName: 'soak',
    justifyData: 'start',
    justifyHeading: 'center',
    width: '75px',
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
    groupBy: ['ungrouped', 'item', 'soak'], // when grouping this array determines if this table col is included or filtered out.
    groupByIncrement: false,
    groupedLeftSticky: ['soak'],
    colType: 'wo',
    defaultSort: false,
  },
  {
    unfilteredColIdx: 99,
    displayName: 'Fresh Frozen',
    dataName: 'fresh_frozen',
    justifyData: 'start',
    justifyHeading: 'center',
    width: '75px',
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
    groupBy: ['ungrouped', 'item', 'fresh_frozen'], // when grouping this array determines if this table col is included or filtered out.
    groupByIncrement: false,
    groupedLeftSticky: ['fresh_frozen'],
    colType: 'wo',
    defaultSort: false,
  },
]

module.exports = workOrderCols
