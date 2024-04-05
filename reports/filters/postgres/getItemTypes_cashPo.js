const sql = require('../../../server')

// applicable item types are related to all received PO's, all open POs, all unpaid PO's

const getItemTypes = async () => {
  try {
    console.log(`query postgres to get list of item types for filters ...`)

    const response = await sql`
    SELECT 
      DISTINCT(TRIM(ms.item_type)) AS label, 
      (TRIM(ms.item_type)) AS "dataName" 
    FROM "purchaseReporting".po_received AS r 
      LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
          ON ms.item_num = r.item_number 
    WHERE 
      ms.item_type IS NOT NULL 
        
    UNION SELECT 
      DISTINCT(TRIM(ms.item_type)) AS label, 
      (TRIM(ms.item_type)) AS "dataName" 
    FROM "purchaseReporting".open_po AS o 
      LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
          ON ms.item_num = o.item_number 
    WHERE 
      ms.item_type IS NOT NULL 

    UNION SELECT 
      DISTINCT(TRIM(ms.item_type)) AS label, 
      (TRIM(ms.item_type)) AS "dataName" 
    FROM "purchaseReporting".unpaid_po AS u 
      LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
          ON ms.item_num = u.item_number 
    WHERE 
      ms.item_type IS NOT NULL 
   
    ` //prettier-ignore

    return response
  } catch (error) {
    console.error(error)
    return error
  }
}

module.exports = getItemTypes
