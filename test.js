const process = async () => {
  const postgres = require('postgres')
  const sql = postgres()

  const testQuery = async () => {
    try {
      const response = await sql
              `SELECT pj.column, 'SUBTOTAL' AS l2_label, 'SUBTOTAL' AS l3_label, 'SUBTOTAL' AS l4_label, 'SUBTOTAL' AS l5_label, SUM(pj.lbs) AS lbs, SUM(pj.sales) AS sales, SUM(pj.cogs) AS cogs, SUM(pj.othp) AS othp 
              
              FROM (
                SELECT null AS doc_num, null AS line_number, null AS item_num, null AS column, 0 AS lbs, 0 AS sales, 0 AS cogs, 0 AS othp 
                
                FROM null
        
                WHERE
                  1=2
                  ) AS pj
                
                  LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
                      ON ms.item_num = pj.item_num
        
              WHERE
                1=1 
               
        
              GROUP BY pj.column
              
              ORDER BY pj.column` //prettier-ignore

      return response
    } catch (error) {
      console.error(error)
      return error
    }
  }

  const response = await testQuery()
  console.log('response', response)
}

process()
