const getReportFormats = () => {
  return [
    {
      default: false, // if this is true then the defaults array should have "all" or else there will be a mistmatch in what the front end and back end beleive is the default
      label: 'species group / program / freeze / WOCL',
      dataName: 'specProgFrzWocl',
      defaultsFallback: false,
      defaults: [],
      optional: ['all'],
      forbiddenCols: [],
      groupingLevel: 4,
      l1_field: 'ms.species_group',
      l2_field: 'ms.program',
      l3_field: 'ms.fg_fresh_frozen',
      l4_field: 'wo.header_classification',
      l1_name: 'species group',
      l2_name: 'program',
      l3_name: 'fresh/frozen',
      l4_name: 'wo classification',
      labelCols: [
        {
          displayName: 'MAJOR CATEGORY', // show as column header
          dataName: 'l1_label', // key to pull data from
          filterName: 'l1_filter', // key to match up the column with the filter
          width: '135px', // css width
          left: '0px', // css positioning for sticky sum of prior col widths
          borderRight: false, // border right on ladst frozen cell
          rightClickMenu: [], // array of options for right click menu
        },
        {
          displayName: 'PROGRAM', // show as column header
          dataName: 'l2_label', // key to pull data from
          filterName: 'l2_filter', // key to match up the column with the filter
          width: '135px', // css width
          left: '135px', // css positioning for sticky sum of prior col widths
          borderRight: false, // border right on ladst frozen cell
          rightClickMenu: [], // array of options for right click menu
        },
        {
          displayName: 'FRESH/FROZEN', // show as column header
          dataName: 'l3_label', // key to pull data from
          filterName: 'l3_filter', // key to match up the column with the filter
          width: '100px', // css width
          left: '170px', // css positioning for sticky sum of prior col widths
          borderRight: false, // border right on ladst frozen cell
          rightClickMenu: [], // array of options for right click menu
        },
        {
          displayName: 'WO CLASS', // show as column header
          dataName: 'l4_label', // key to pull data from
          filterName: 'l4_filter', // key to match up the column with the filter
          width: '75px', // css width
          left: '245px', // css positioning for sticky sum of prior col widths
          borderRight: true, // border right on ladst frozen cell
          rightClickMenu: [], // array of options for right click menu
        },
      ],
    },
  ]
}

module.exports = getReportFormats
