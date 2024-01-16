const sql = require('../../../server')

const getProductionCountryFilters = async config => {
  console.log(`query postgres for getProductionCountryFilters ...`)

  const filters = await sql` 
    WITH REVERSED_ROWS AS (
      SELECT 
        DISTINCT(TRIM(ms.program_country)) AS label,
        ROW_NUMBER() OVER (ORDER BY ms.program_country DESC) AS reversed_row_number
      FROM "invenReporting".master_supplement AS ms
      WHERE 
        ms.program_country IS NOT NULL 
        AND ms.wo_entity IS NOT NULL
    )

    SELECT 
        label,
        label AS "dataName", 
        CASE
          WHEN reversed_row_number = 1 THEN true
          ELSE false
        END AS default,
        CASE
          WHEN reversed_row_number = 1 THEN true
          ELSE false
        END AS "trueOnNoSelection"
    FROM REVERSED_ROWS 
    `

  return filters
}

module.exports = getProductionCountryFilters
