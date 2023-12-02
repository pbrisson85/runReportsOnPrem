const getLabelColsTemplate = () => {
  const template = {
    justifyData: 'start', // css justify content
    justifyHeading: 'center', // css justify content
    number: false, // flag to use formatTableDataNumber model
    decimals: 0, // if number is true, decimals will be used
    leftSticky: true, // css sticky
    hidden: false, // flag to hide column.
    view: null, // dataset to show for the column (extended_cost, weight, cost_per_lb)
    data: false,
    colType: 'label',
    optional: false, // flag to determine if the col is optional
    showByDefault: true, // flag to determine if optional col is shown by default
  }

  return template
}

module.exports = getCols
