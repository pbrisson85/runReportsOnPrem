const invenTotalCols = [
  {
    unfilteredColIdx: 1,
    displayName: 'INVEN',
    dataName: 'INVEN',
    justifyData: 'end',
    justifyHeading: 'center',
    width: '100px',
    number: true,
    boolean: false,
    decimals: 0, // flip when fliping view
    rightSticky: true,
    right: '400px',
    borderLeft: true,
    hidden: false,
    view: 'lbs',
    valueFallback: 0,
    data: true,
    popoverMsg: '',
    rightClickMenu: ['Get Details'],
    drilldownRightClickMenu: ['Get Details'],
    colType: 'invenTotal', // Make sure to update the getViewFilter on the back end to allow this colType in the view
    drillDownSortable: true,
    optional: true, // flag to determine if the col is optional
    showByDefault: true, // flag to determine if optional col is shown by default
  },
  // {
  //   unfilteredColIdx: 1,
  //   displayName: 'IN TRANSIT',
  //   dataName: 'INV IN TRANSIT',
  //   justifyData: 'end',
  //   justifyHeading: 'center',
  //   width: '100px',
  //   number: true,
  //   boolean: false,
  //   decimals: 0, // flip when fliping view
  //   rightSticky: true,
  //   right: '300px',
  //   borderLeft: false,
  //   hidden: false,
  //   view: 'lbs',
  //   valueFallback: 0,
  //   data: true,
  //   subColStyle: true, // styling CHANGE NAME BECAUSE ON HAND COLS OF IN TRANSIT, IN COUNTRY, OUT OF COUNTRY, ETC WILL ALSO USE THIS
  //   popoverMsg: 'IN TRANSIT - All FG inventory that is in an "In Transit" location code',
  //   rightClickMenu: ['Get Details'],
  //   drilldownRightClickMenu: ['Get Details'],
  //   colType: 'invenTotal', // Make sure to update the getViewFilter on the back end to allow this colType in the view
  //   drillDownSortable: true,
  //   optional: true, // flag to determine if the col is optional
  //   showByDefault: false, // flag to determine if optional col is shown by default
  // },
  // {
  //   unfilteredColIdx: 1,
  //   displayName: 'OH ALL',
  //   dataName: 'INV ON HAND',
  //   justifyData: 'end',
  //   justifyHeading: 'center',
  //   width: '100px',
  //   number: true,
  //   boolean: false,
  //   decimals: 0, // flip when fliping view
  //   rightSticky: true,
  //   right: '200px',
  //   borderLeft: false,
  //   hidden: false,
  //   view: 'lbs',
  //   valueFallback: 0,
  //   data: true,
  //   subColStyle: true, // styling CHANGE NAME BECAUSE ON HAND COLS OF IN TRANSIT, IN COUNTRY, OUT OF COUNTRY, ETC WILL ALSO USE THIS
  //   popoverMsg: 'ON HAND ALL - On hand, at location (not in-transit), including tagged and untagged inventory',
  //   rightClickMenu: ['Get Details'],
  //   drilldownRightClickMenu: ['Get Details'],
  //   colType: 'invenTotal', // Make sure to update the getViewFilter on the back end to allow this colType in the view
  //   drillDownSortable: true,
  //   optional: true, // flag to determine if the col is optional
  //   showByDefault: false, // flag to determine if optional col is shown by default
  // },
  // {
  //   unfilteredColIdx: 1,
  //   displayName: 'OH TAGGED',
  //   dataName: 'INV ON HAND TAGGED',
  //   justifyData: 'end',
  //   justifyHeading: 'center',
  //   width: '100px',
  //   number: true,
  //   boolean: false,
  //   decimals: 0, // flip when fliping view
  //   rightSticky: true,
  //   right: '200px',
  //   borderLeft: false,
  //   hidden: false,
  //   view: 'lbs',
  //   valueFallback: 0,
  //   data: true,
  //   subColStyle: true, // styling CHANGE NAME BECAUSE ON HAND COLS OF IN TRANSIT, IN COUNTRY, OUT OF COUNTRY, ETC WILL ALSO USE THIS
  //   popoverMsg: '...',
  //   rightClickMenu: ['Get Details'],
  //   drilldownRightClickMenu: ['Get Details'],
  //   colType: 'invenTotal', // Make sure to update the getViewFilter on the back end to allow this colType in the view
  //   drillDownSortable: true,
  //   optional: true, // flag to determine if the col is optional
  //   showByDefault: false, // flag to determine if optional col is shown by default
  // },
  // {
  //   unfilteredColIdx: 1,
  //   displayName: 'OH UNTAGGED',
  //   dataName: 'INV ON HAND UNTAGGED',
  //   justifyData: 'end',
  //   justifyHeading: 'center',
  //   width: '100px',
  //   number: true,
  //   boolean: false,
  //   decimals: 0, // flip when fliping view
  //   rightSticky: true,
  //   right: '100px',
  //   borderLeft: false,
  //   hidden: false,
  //   view: 'lbs',
  //   valueFallback: 0,
  //   data: true,
  //   subColStyle: true, // styling CHANGE NAME BECAUSE ON HAND COLS OF IN TRANSIT, IN COUNTRY, OUT OF COUNTRY, ETC WILL ALSO USE THIS
  //   popoverMsg:
  //     'INV ON HAND UNTAGGED - On hand, at location (not in-transit), has not been allocatted to a specific order. (Note that this col is included in OH ALL)',
  //   rightClickMenu: ['Get Details'],
  //   drilldownRightClickMenu: ['Get Details'],
  //   colType: 'invenTotal', // Make sure to update the getViewFilter on the back end to allow this colType in the view
  //   drillDownSortable: true,
  //   optional: true, // flag to determine if the col is optional
  //   showByDefault: false, // flag to determine if optional col is shown by default
  // },
]

module.exports = invenTotalCols
