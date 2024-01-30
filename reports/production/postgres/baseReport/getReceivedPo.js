const sql = require('../../../../server')

/* *********************************************** Level 1 *********************************************** */

const l1_getReceivedPo = async config => {
  if (!config.baseFormat.l1_field) return []

  //${config.jbBuyer ? sql`AND po.item_number IN SELECT(DISTINCT(perpetual_inventory.item_number FROM ))` : sql``}
  try {
    console.log(`${config.user} - level 1: query postgres for FG open PO (l1_getReceivedPo) ...`)

    const response = await sql
         `SELECT 
         'PURCHASE RECEIPTS' AS column, 
         COALESCE(${sql(config.baseFormat.l1_field)},'NO VALUE') AS l1_label, 
         'SUBTOTAL' AS l2_label, 
         'SUBTOTAL' AS l3_label, 
         'SUBTOTAL' AS l4_label, 
         'SUBTOTAL' AS l5_label, 
         COALESCE(SUM(po.weight),0) AS lbs, 
         COALESCE(SUM(po.extended_cost),0) As cost, 
         COALESCE(SUM(po.extended_cost)/NULLIF(SUM(po.weight),0),0) AS "costPerLb"
        
         FROM "purchaseReporting".po_data AS po 
          LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
            ON ms.item_num = po.item_number 
          LEFT OUTER JOIN "accountingPeriods".period_by_day AS p
            ON po.receipt_date = p.formatted_date
         
         WHERE 
          po.po_offset = FALSE
          AND po.extended_cost <> 0 
          ${!config.trends.yearTrend ? sql`
              AND p.formatted_date >= ${config.totals.primary.startDate} 
              AND p.formatted_date <= ${config.totals.primary.endDate}` : 
            sql`
              AND ${sql(config.trends.yearTrend.period_name)} >= ${config.trends.yearTrend.start_period} 
              AND ${sql(config.trends.yearTrend.period_name)} <= ${config.trends.yearTrend.end_period} 
              AND ${sql(config.trends.queryGrouping)} IN ${sql(config.trends.yearTrend.years)}
            ` }
          ${config.baseFilters.itemType ? sql`AND ms.item_type IN ${sql(config.baseFilters.itemType)}`: sql``} 
          ${config.baseFilters.program ? sql`AND ms.program = ${config.baseFilters.program}` : sql``} 
          ${config.userPermissions.joeB ? sql`AND ms.item_num IN (SELECT jb.item_number FROM "purchaseReporting".jb_purchase_items AS jb)` : sql``}
         
         GROUP BY ${sql(config.baseFormat.l1_field)}` //prettier-ignore

    return response
  } catch (error) {
    console.error(error)
    return error
  }
}

/* *********************************************** Level 2 *********************************************** */

// FG open PO grouped by program (includes in transit)

const l2_getReceivedPo = async config => {
  if (!config.baseFormat.l2_field) return []

  try {
    console.log(`${config.user} - level 2: query postgres for FG open PO (l2_getReceivedPo) ...`)

    const response = await sql
       `SELECT 
       'PURCHASE RECEIPTS' AS column, 
       COALESCE(${sql(config.baseFormat.l1_field)},'NO VALUE') AS l1_label, 
       COALESCE(${sql(config.baseFormat.l2_field)},'NO VALUE') AS l2_label, 
       'SUBTOTAL' AS l3_label, 
       'SUBTOTAL' AS l4_label, 
       'SUBTOTAL' AS l5_label, 
       COALESCE(SUM(po.weight),0) AS lbs, 
      COALESCE(SUM(po.extended_cost),0) As cost, 
      COALESCE(SUM(po.extended_cost)/NULLIF(SUM(po.weight),0),0) AS "costPerLb"
       
       FROM "purchaseReporting".po_data AS po 
        LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
          ON ms.item_num = po.item_number 
        LEFT OUTER JOIN "accountingPeriods".period_by_day AS p
            ON po.receipt_date = p.formatted_date
       
       WHERE 
        po.po_offset = FALSE
        AND po.extended_cost <> 0 
        ${!config.trends.yearTrend ? sql`
              AND p.formatted_date >= ${config.totals.primary.startDate} 
              AND p.formatted_date <= ${config.totals.primary.endDate}` : 
            sql`
              AND ${sql(config.trends.yearTrend.period_name)} >= ${config.trends.yearTrend.start_period} 
              AND ${sql(config.trends.yearTrend.period_name)} <= ${config.trends.yearTrend.end_period} 
              AND ${sql(config.trends.queryGrouping)} IN ${sql(config.trends.yearTrend.years)}
            ` }
        ${config.baseFilters.itemType ? sql`AND ms.item_type IN ${sql(config.baseFilters.itemType)}`: sql``} 
        ${config.baseFilters.program ? sql`AND ms.program = ${config.baseFilters.program}` : sql``} 
        ${config.userPermissions.joeB ? sql`AND ms.item_num IN (SELECT jb.item_number FROM "purchaseReporting".jb_purchase_items AS jb)` : sql``} 
       
       GROUP BY ${sql(config.baseFormat.l1_field)}, ${sql(config.baseFormat.l2_field)}` //prettier-ignore

    return response
  } catch (error) {
    console.error(error)
    return error
  }
}

/* *********************************************** Level 3 *********************************************** */

// FG open PO grouped by program (includes in transit)

const l3_getReceivedPo = async config => {
  if (!config.baseFormat.l3_field) return []

  try {
    console.log(`${config.user} - level 3: query postgres for FG open PO (l3_getReceivedPo) ...`)

    const response = await sql
       `SELECT 
       'PURCHASE RECEIPTS' AS column, 
       COALESCE(${sql(config.baseFormat.l1_field)},'NO VALUE') AS l1_label, 
       COALESCE(${sql(config.baseFormat.l2_field)},'NO VALUE') AS l2_label, 
       COALESCE(${sql(config.baseFormat.l3_field)},'NO VALUE') AS l3_label, 
       'SUBTOTAL' AS l4_label, 
       'SUBTOTAL' AS l5_label, 
        COALESCE(SUM(po.weight),0) AS lbs, 
        COALESCE(SUM(po.extended_cost),0) As cost, 
        COALESCE(SUM(po.extended_cost)/NULLIF(SUM(po.weight),0),0) AS "costPerLb"
       
       FROM "purchaseReporting".po_data AS po 
        LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
          ON ms.item_num = po.item_number 
        LEFT OUTER JOIN "accountingPeriods".period_by_day AS p
            ON po.receipt_date = p.formatted_date
       
       WHERE 
        po.po_offset = FALSE
        AND po.extended_cost <> 0 
        ${!config.trends.yearTrend ? sql`
              AND p.formatted_date >= ${config.totals.primary.startDate} 
              AND p.formatted_date <= ${config.totals.primary.endDate}` : 
            sql`
              AND ${sql(config.trends.yearTrend.period_name)} >= ${config.trends.yearTrend.start_period} 
              AND ${sql(config.trends.yearTrend.period_name)} <= ${config.trends.yearTrend.end_period} 
              AND ${sql(config.trends.queryGrouping)} IN ${sql(config.trends.yearTrend.years)}
            ` }
        ${config.baseFilters.itemType ? sql`AND ms.item_type IN ${sql(config.baseFilters.itemType)}`: sql``} 
        ${config.baseFilters.program ? sql`AND ms.program = ${config.baseFilters.program}`: sql``} 
        ${config.userPermissions.joeB ? sql`AND ms.item_num IN (SELECT jb.item_number FROM "purchaseReporting".jb_purchase_items AS jb)` : sql``}
       
       GROUP BY ${sql(config.baseFormat.l1_field)}, ${sql(config.baseFormat.l2_field)}, ${sql(config.baseFormat.l3_field)}` //prettier-ignore

    return response
  } catch (error) {
    console.error(error)
    return error
  }
}

/* *********************************************** Level 4 *********************************************** */

// FG open PO grouped by program (includes in transit)

const l4_getReceivedPo = async config => {
  if (!config.baseFormat.l4_field) return []

  try {
    console.log(`${config.user} - level 4: query postgres for FG open PO (l4_getReceivedPo) ...`)

    const response = await sql
       `SELECT 
       'PURCHASE RECEIPTS' AS column, 
       COALESCE(${sql(config.baseFormat.l1_field)},'NO VALUE') AS l1_label, 
       COALESCE(${sql(config.baseFormat.l2_field)},'NO VALUE') AS l2_label, 
       COALESCE(${sql(config.baseFormat.l3_field)},'NO VALUE') AS l3_label, 
       COALESCE(${sql(config.baseFormat.l4_field)},'NO VALUE') AS l4_label, 
       'SUBTOTAL' AS l5_label, 
        COALESCE(SUM(po.weight),0) AS lbs, 
        COALESCE(SUM(po.extended_cost),0) As cost, 
        COALESCE(SUM(po.extended_cost)/NULLIF(SUM(po.weight),0),0) AS "costPerLb"
       
       FROM "purchaseReporting".po_data AS po 
        LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
          ON ms.item_num = po.item_number 
        LEFT OUTER JOIN "accountingPeriods".period_by_day AS p
            ON po.receipt_date = p.formatted_date
       
       WHERE 
        po.po_offset = FALSE
        AND po.extended_cost <> 0 
        ${!config.trends.yearTrend ? sql`
              AND p.formatted_date >= ${config.totals.primary.startDate} 
              AND p.formatted_date <= ${config.totals.primary.endDate}` : 
            sql`
              AND ${sql(config.trends.yearTrend.period_name)} >= ${config.trends.yearTrend.start_period} 
              AND ${sql(config.trends.yearTrend.period_name)} <= ${config.trends.yearTrend.end_period} 
              AND ${sql(config.trends.queryGrouping)} IN ${sql(config.trends.yearTrend.years)}
            ` }
        ${config.baseFilters.itemType ? sql`AND ms.item_type IN ${sql(config.baseFilters.itemType)}`: sql``} 
        ${config.baseFilters.program ? sql`AND ms.program = ${config.baseFilters.program}`: sql``} 
        ${config.userPermissions.joeB ? sql`AND ms.item_num IN (SELECT jb.item_number FROM "purchaseReporting".jb_purchase_items AS jb)` : sql``}
       
       GROUP BY ${sql(config.baseFormat.l1_field)}, ${sql(config.baseFormat.l2_field)}, ${sql(config.baseFormat.l3_field)}, ${sql(config.baseFormat.l4_field)}` //prettier-ignore

    return response
  } catch (error) {
    console.error(error)
    return error
  }
}

/* *********************************************** Level 4 *********************************************** */

// FG open PO grouped by program (includes in transit)

const l5_getReceivedPo = async config => {
  if (!config.baseFormat.l5_field) return []

  try {
    console.log(`${config.user} - level 5: query postgres for FG open PO (l4_getReceivedPo) ...`)

    const response = await sql
       `SELECT 
       'PURCHASE RECEIPTS' AS column, 
       COALESCE(${sql(config.baseFormat.l1_field)},'NO VALUE') AS l1_label, 
       COALESCE(${sql(config.baseFormat.l2_field)},'NO VALUE') AS l2_label, 
       COALESCE(${sql(config.baseFormat.l3_field)},'NO VALUE') AS l3_label, 
       COALESCE(${sql(config.baseFormat.l4_field)},'NO VALUE') AS l4_label, 
       COALESCE(${sql(config.baseFormat.l5_field)},'NO VALUE') AS l5_label, 
       COALESCE(SUM(po.weight),0) AS lbs, 
        COALESCE(SUM(po.extended_cost),0) As cost,  
        COALESCE(SUM(po.extended_cost)/NULLIF(SUM(po.weight),0),0) AS "costPerLb"
       
       FROM "purchaseReporting".po_data AS po 
        LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
          ON ms.item_num = po.item_number 
        LEFT OUTER JOIN "accountingPeriods".period_by_day AS p
          ON po.receipt_date = p.formatted_date
       
       WHERE 
        po.po_offset = FALSE
        AND po.extended_cost <> 0 
        ${!config.trends.yearTrend ? sql`
              AND p.formatted_date >= ${config.totals.primary.startDate} 
              AND p.formatted_date <= ${config.totals.primary.endDate}` : 
            sql`
              AND ${sql(config.trends.yearTrend.period_name)} >= ${config.trends.yearTrend.start_period} 
              AND ${sql(config.trends.yearTrend.period_name)} <= ${config.trends.yearTrend.end_period} 
              AND ${sql(config.trends.queryGrouping)} IN ${sql(config.trends.yearTrend.years)}
            ` }
        ${config.baseFilters.itemType ? sql`AND ms.item_type IN ${sql(config.baseFilters.itemType)}`: sql``} 
        ${config.baseFilters.program ? sql`AND ms.program = ${config.baseFilters.program}`: sql``} 
        ${config.userPermissions.joeB ? sql`AND ms.item_num IN (SELECT jb.item_number FROM "purchaseReporting".jb_purchase_items AS jb)` : sql``}
       
       GROUP BY ${sql(config.baseFormat.l1_field)}, ${sql(config.baseFormat.l2_field)}, ${sql(config.baseFormat.l3_field)}, ${sql(config.baseFormat.l4_field)}, ${sql(config.baseFormat.l5_field)}` //prettier-ignore

    return response
  } catch (error) {
    console.error(error)
    return error
  }
}

/* *********************************************** TOTAL *********************************************** */

const l0_getReceivedPo = async config => {
  try {
    console.log(`${config.user} - level 0: query postgres for FG open PO (l0_getReceivedPo) ...`)

    const response = await sql
         `SELECT 
         'PURCHASE RECEIPTS' AS column, 
         'TOTAL' AS l1_label,
         COALESCE(SUM(po.weight),0) AS lbs, 
         COALESCE(SUM(po.extended_cost),0) As cost, 
         COALESCE(SUM(po.extended_cost)/NULLIF(SUM(po.weight),0),0) AS "costPerLb"
         
         FROM "purchaseReporting".po_data AS po 
          LEFT OUTER JOIN "invenReporting".master_supplement AS ms 
            ON ms.item_num = po.item_number 
          LEFT OUTER JOIN "accountingPeriods".period_by_day AS p
            ON po.receipt_date = p.formatted_date
         
         WHERE 
          po.po_offset = FALSE
          AND po.extended_cost <> 0 
          ${!config.trends.yearTrend ? sql`
              AND p.formatted_date >= ${config.totals.primary.startDate} 
              AND p.formatted_date <= ${config.totals.primary.endDate}` : 
            sql`
              AND ${sql(config.trends.yearTrend.period_name)} >= ${config.trends.yearTrend.start_period} 
              AND ${sql(config.trends.yearTrend.period_name)} <= ${config.trends.yearTrend.end_period} 
              AND ${sql(config.trends.queryGrouping)} IN ${sql(config.trends.yearTrend.years)}
            ` }
          ${config.baseFilters.itemType ? sql`AND ms.item_type IN ${sql(config.baseFilters.itemType)}`: sql``} 
          ${config.baseFilters.program ? sql`AND ms.program = ${config.baseFilters.program}`: sql``} 
          ${config.userPermissions.joeB ? sql`AND ms.item_num IN (SELECT jb.item_number FROM "purchaseReporting".jb_purchase_items AS jb)` : sql``}` //prettier-ignore

    return response
  } catch (error) {
    console.error(error)
    return error
  }
}

module.exports = { l1_getReceivedPo, l2_getReceivedPo, l3_getReceivedPo, l4_getReceivedPo, l5_getReceivedPo, l0_getReceivedPo }
