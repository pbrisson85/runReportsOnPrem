// The problem with pulling the sales by customer is that the customer name can be changed on the sales order. In these cases there will be multiple lines for each customer for each code/name combination. Therefore the getViewTrendConfig for customer only pulls the customer code and not the name. THIS is a routine to add the name at the completion of the query.

const sql = require('../../../../server')

const addCustomerName = async data => {
  // Pull list of customer names from customer master

  const withNames = data.map(row => {
    return {
      ...row,
      l2_label: 'test',
    }
  })

  return withNames
}

module.exports = addCustomerName
