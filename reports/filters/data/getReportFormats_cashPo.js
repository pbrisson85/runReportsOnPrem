// Note that additionally front end (query params) needs to be updated

const getReportFormats = () => {
  return [
    {
      default: false, // if this is true then the defaults array should have "all" or else there will be a mistmatch in what the front end and back end beleive is the default
      label: 'type / species group / program', // appears in front end report options
      dataName: 'typeSpecgroupProg', // passed back as "reportFormat" in the front end request. Maps to "invenReporting".master_supplement in reports/sales/utils/config/itemMasterSupplementQueryMap.js
      defaultsFallback: false, // front end uses defaults array to map a program filter to the default report format. If the program does not appear in any array (which would be a mistake) then this flag will be for the fallbackDefault
      defaults: [], //list of programs (datanames) that this is the defaultsFallback report
      optional: ['all'], // list of programs (datanames) that allow this,  or use 'any' to allow all programs EXCEPT 'all'
      forbiddenCols: [], // columns that will be hidden and will not show as optional
      groupingLevel: 3, // how many fields are in the grouping? routine uses this in verious groupings, stored in the config upon the request.
      l1_field: 'ms.item_type', // passed back to config for queries
      l2_field: 'ms.species_group', // passed back to config for queries
      l3_field: 'ms.program', // passed back to config for queries
      l1_name: 'item type', // only used as readable description for active filters on front end.
      l2_name: 'species group', // only used as readable description for active filters on front end.
      l3_name: 'program', // only used as readable description for active filters on front end.
      labelCols: [
        {
          displayName: 'ITEM TYPE', // show as column header
          dataName: 'l1_label', // key to pull data from
          filterName: 'l1_filter', // key to match up the column with the filter
          width: '100px', // css width
          left: '0px', // css positioning for sticky sum of prior col widths
          borderRight: false, // border right on ladst frozen cell
          rightClickMenu: [], // array of options for right click menu
        },
        {
          displayName: 'MAJOR CATEGORY', // show as column header
          dataName: 'l2_label', // key to pull data from
          filterName: 'l2_filter', // key to match up the column with the filter
          width: '175px', // css width
          left: '100px', // css positioning for sticky sum of prior col widths
          borderRight: false, // border right on ladst frozen cell
          rightClickMenu: [], // array of options for right click menu
        },
        {
          displayName: 'PROGRAM', // show as column header
          dataName: 'l3_label', // key to pull data from
          filterName: 'l3_filter', // key to match up the column with the filter
          width: '175px', // css width
          left: '275px', // css positioning for sticky sum of prior col widths
          borderRight: true, // border right on ladst frozen cell
          rightClickMenu: [], // array of options for right click menu
        },
      ],
    },
    {
      default: false, // if no report is chosen (such as on first request) this will be used to group report if true
      label: 'species group / program / type', // appears in front end report options
      dataName: 'pecgroupProgType', // passed back as "reportFormat" in the front end request. Maps to "invenReporting".master_supplement in reports/sales/utils/config/itemMasterSupplementQueryMap.js
      defaultsFallback: false, // front end uses defaults array to map a program filter to the default report format. If the program does not appear in any array (which would be a mistake) then this flag will be for the fallbackDefault
      defaults: [], //list of programs (datanames) that this is the defaultsFallback report
      optional: ['all'], // list of programs (datanames) that allow this,  or use 'any' to allow all programs EXCEPT 'all'
      forbiddenCols: [], // columns that will be hidden and will not show as optional
      groupingLevel: 3, // how many fields are in the grouping? routine uses this in verious groupings, stored in the config upon the request.
      l1_field: 'ms.species_group', // passed back to config for queries
      l2_field: 'ms.program', // passed back to config for queries
      l3_field: 'ms.item_type', // passed back to config for queries
      l1_name: 'species group', // only used as readable description for active filters on front end.
      l2_name: 'program', // only used as readable description for active filters on front end.
      l3_name: 'item type', // only used as readable description for active filters on front end.
      labelCols: [
        {
          displayName: 'MAJOR CATEGORY', // show as column header
          dataName: 'l1_label', // key to pull data from
          filterName: 'l1_filter', // key to match up the column with the filter
          width: '175px', // css width
          left: '0px', // css positioning for sticky sum of prior col widths
          borderRight: false, // border right on ladst frozen cell
          rightClickMenu: [], // array of options for right click menu
        },
        {
          displayName: 'PROGRAM', // show as column header
          dataName: 'l2_label', // key to pull data from
          filterName: 'l2_filter', // key to match up the column with the filter
          width: '175px', // css width
          left: '175px', // css positioning for sticky sum of prior col widths
          borderRight: false, // border right on ladst frozen cell
          rightClickMenu: [], // array of options for right click menu
        },
        {
          displayName: 'ITEM TYPE', // show as column header
          dataName: 'l3_label', // key to pull data from
          filterName: 'l3_filter', // key to match up the column with the filter
          width: '100px', // css width
          left: '350px', // css positioning for sticky sum of prior col widths
          borderRight: true, // border right on ladst frozen cell
          rightClickMenu: [], // array of options for right click menu
        },
      ],
    },
    {
      default: true, // if this is true then the defaults array should have "all" or else there will be a mistmatch in what the front end and back end beleive is the default
      label: 'type / program',
      dataName: 'typeProg',
      defaultsFallback: false,
      defaults: ['all'],
      optional: ['all'],
      forbiddenCols: [],
      groupingLevel: 2,
      l1_field: 'ms.item_type',
      l2_field: 'ms.program',
      l1_name: 'item type',
      l2_name: 'program',
      labelCols: [
        {
          displayName: 'ITEM TYPE', // show as column header
          dataName: 'l1_label', // key to pull data from
          filterName: 'l1_filter', // key to match up the column with the filter
          width: '175px', // css width
          left: '0px', // css positioning for sticky sum of prior col widths
          rightClickMenu: [], // array of options for right click menu
        },
        {
          displayName: 'PROGRAM', // show as column header
          dataName: 'l2_label', // key to pull data from
          filterName: 'l2_filter', // key to match up the column with the filter
          width: '175px', // css width
          left: '175px', // css positioning for sticky sum of prior col widths
          borderRight: true, // border right on ladst frozen cell
          rightClickMenu: [], // array of options for right click menu
        },
      ],
    },
    {
      default: false, // if this is true then the defaults array should have "all" or else there will be a mistmatch in what the front end and back end beleive is the default
      label: 'species group / program',
      dataName: 'speciesgroupProg',
      defaultsFallback: false,
      defaults: [],
      optional: ['all'],
      forbiddenCols: [],
      groupingLevel: 2,
      l1_field: 'ms.species_group',
      l2_field: 'ms.program',
      l1_name: 'species group',
      l2_name: 'program',
      labelCols: [
        {
          displayName: 'MAJOR CATEGORY', // show as column header
          dataName: 'l1_label', // key to pull data from
          filterName: 'l1_filter', // key to match up the column with the filter
          width: '175px', // css width
          left: '0px', // css positioning for sticky sum of prior col widths
          rightClickMenu: [], // array of options for right click menu
        },
        {
          displayName: 'PROGRAM', // show as column header
          dataName: 'l2_label', // key to pull data from
          filterName: 'l2_filter', // key to match up the column with the filter
          width: '175px', // css width
          left: '175px', // css positioning for sticky sum of prior col widths
          borderRight: true, // border right on ladst frozen cell
          rightClickMenu: [], // array of options for right click menu
        },
      ],
    },
    {
      label: 'species group / program / species',
      dataName: 'speciesgroupProgSpec',
      defaultsFallback: false,
      defaults: [],
      optional: ['all'],
      forbiddenCols: [],
      groupingLevel: 3,
      l1_field: 'ms.species_group',
      l2_field: 'ms.program',
      l3_field: 'ms.species',
      l1_name: 'species group',
      l2_name: 'program',
      l3_name: 'species',
      labelCols: [
        {
          displayName: 'MAJOR CATEGORY', // show as column header
          dataName: 'l1_label', // key to pull data from
          filterName: 'l1_filter', // key to match up the column with the filter
          width: '175px', // css width
          left: '0px', // css positioning for sticky sum of prior col widths
          rightClickMenu: [], // array of options for right click menu
        },
        {
          displayName: 'PROGRAM', // show as column header
          dataName: 'l2_label', // key to pull data from
          filterName: 'l2_filter', // key to match up the column with the filter
          width: '175px', // css width
          left: '175px', // css positioning for sticky sum of prior col widths
          borderRight: false, // border right on ladst frozen cell
          rightClickMenu: [], // array of options for right click menu
        },
        {
          displayName: 'SPECIES', // show as column header
          dataName: 'l3_label', // key to pull data from
          filterName: 'l3_filter', // key to match up the column with the filter
          width: '175px', // css width
          left: '350px', // css positioning for sticky sum of prior col widths
          borderRight: true, // border right on ladst frozen cell
          rightClickMenu: [], // array of options for right click menu
        },
      ],
    },
  ]
}

module.exports = getReportFormats
