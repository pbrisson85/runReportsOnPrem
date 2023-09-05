const sql = require('../../../../server')
const unflattenByCompositKey = require('../../models/unflattenByCompositKey')

// The problem with pulling the sales by customer is that the customer name can be changed on the sales order. In these cases there will be multiple lines for each customer for each code/name combination. Therefore the getViewTrendConfig for customer only pulls the customer code and not the name. THIS is a routine to add the name at the completion of the query.

const addCustomerName = async data => {
  // Pull customer name from sales and orders using mode (most frequently used name)
  const customerName = await sql`
   SELECT sl.customer_code, mode() WITHIN GROUP (ORDER BY sl.customer_name) AS customer_name
     FROM "salesReporting".sales_line_items AS sl
       GROUP BY sl.customer_code
   UNION
   SELECT so.customer_code, mode() WITHIN GROUP (ORDER BY so.customer_name) AS customer_name
     FROM "salesReporting".sales_orders AS so
       GROUP BY so.customer_code
 `

  console.log('customerName: ', customerName)

  // unflatten
  const customerNameUnflattened = unflattenByCompositKey(customerName, { 1: 'customer_code' })

  const withNames = data.map((row, idx) => {
    if (idx === 0) console.log('row: ', row)
    if (idx === 0) console.log('customerNameUnflattened[row.l1_label]: ', customerNameUnflattened[row.l1_label])

    // Dont add name if total row
    if (row.totalRow) return row

    // Add name to row

    // Add name
    return {
      ...row,
      l2_label: customerNameUnflattened[row.l1_label]?.customer_name,
    }
  })

  return withNames
}

module.exports = addCustomerName
