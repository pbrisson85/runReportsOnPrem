const sql = require('../../../server')

const getProductionCountryFilters = async config => {
  console.log(`query postgres for getProductionCountryFilters ...`)

  const filters = await sql` 
    SELECT 
        DISTINCT(TRIM(ms.program_country)) AS label, 
        (TRIM(ms.program_country)) AS "dataName",
        TRUE AS default 
    FROM "invenReporting".master_supplement AS ms 
    WHERE 
      ms.program_country IS NOT NULL 
      AND ms.wo_entity IS NOT NULL
      
    `

  console.log('filters: ', filters)

  return filters
}

module.exports = getProductionCountryFilters
