const getViewTrendConfig = rightMenuSelection => {
  switch (rightMenuSelection) {
    case 'Trend By Item':
      return {
        sl: {
          l1_label: 'ms.item_num',
          l2_label: 'ms.description',
          l3_label: 'ms.fg_fresh_frozen',
          l4_label: 'ms.fg_treatment',
          l5_label: 'ms.brand',
          l6_label: 'ms.size_name',
        },
        so: {
          l1_label: 'ms.item_num',
          l2_label: 'ms.description',
          l3_label: 'ms.fg_fresh_frozen',
          l4_label: 'ms.fg_treatment',
          l5_label: 'ms.brand',
          l6_label: 'ms.size_name',
        },
        pr: {
          l1_label: 'ms.item_num',
          l2_label: 'ms.description',
          l3_label: 'ms.fg_fresh_frozen',
          l4_label: 'ms.fg_treatment',
          l5_label: 'ms.brand',
          l6_label: 'ms.size_name',
        },
        inv: {
          l1_label: 'ms.item_num',
          l2_label: 'ms.description',
          l3_label: 'ms.fg_fresh_frozen',
          l4_label: 'ms.fg_treatment',
          l5_label: 'ms.brand',
          l6_label: 'ms.size_name',
        },
      }

    case 'Trend By Customer':
      return {
        sl: {
          l1_label: 'sl.customer_code',
          // l2_label: 'sl.customer_name', // cant include because there are non-unique customer names per customer code
        },
        so: {
          l1_label: 'so.customer_code',
          // l2_label: 'so.customer_name', // cant include because there are non-unique customer names per customer code
        },
        pr: {
          l1_label: 'pr.customer_code',
          // l2_label: 'so.customer_name', // cant include because there are non-unique customer names per customer code
        },
        inv: {},
      }

    case 'Trend By Salesperson':
      return {
        sl: {
          l1_label: 'sl.outside_salesperson_code',
          l2_label: 'sl.outside_salesperson_name',
        },
        so: {
          l1_label: 'so.out_sales_rep',
          l2_label: 'so.out_sales_rep_name',
        },
        pr: {
          l1_label: 'pr.sales_rep',
          l2_label: 'pr.sales_rep_name',
        },
        inv: {},
      }

    case 'Trend By USA vs Export':
      return {
        sl: {
          l1_label: 'sl.domestic',
        },
        so: {
          l1_label: 'so.domestic',
        },
        pr: {
          l1_label: 'pr.domestic',
        },
        inv: {},
      }

    case 'Trend By North America vs Foreign':
      return {
        sl: {
          l1_label: 'sl.north_america',
        },
        so: {
          l1_label: 'so.north_america',
        },
        pr: {
          l1_label: 'pr.north_america',
        },
        inv: {},
      }

    case 'Trend By Country':
      return {
        sl: {
          l1_label: 'sl.country',
        },
        so: {
          l1_label: 'so.country',
        },
        pr: {
          l1_label: 'pr.country',
        },
        inv: {},
      }

    case 'Trend By State':
      return {
        sl: {
          l1_label: 'sl.state',
        },
        so: {
          l1_label: 'so.state',
        },
        pr: {
          l1_label: 'pr.state',
        },
        inv: {},
      }

    case 'Trend By Fresh vs Frozen':
      return {
        sl: { l1_label: 'ms.fg_fresh_frozen' },
        so: { l1_label: 'ms.fg_fresh_frozen' },
        pr: { l1_label: 'ms.fg_fresh_frozen' },
        inv: { l1_label: 'ms.fg_fresh_frozen' },
      }

    case 'Trend By Customer Type':
      return {
        sl: { l1_label: 'cs.category' },
        so: { l1_label: 'cs.category' },
        pr: { l1_label: 'cs.category' },
        inv: {},
      }

    case 'Trend By Species Group':
      return {
        sl: { l1_label: 'ms.species_group' },
        so: { l1_label: 'ms.species_group' },
        pr: { l1_label: 'ms.species_group' },
        inv: { l1_label: 'ms.species_group' },
      }

    case 'Trend By Program':
      return {
        sl: { l1_label: 'ms.program' },
        so: { l1_label: 'ms.program' },
        pr: { l1_label: 'ms.program' },
        inv: { l1_label: 'ms.program' },
      }

    case 'Trend By Species':
      return {
        sl: { l1_label: 'ms.species' },
        so: { l1_label: 'ms.species' },
        pr: { l1_label: 'ms.species' },
        inv: { l1_label: 'ms.species' },
      }
  }
}

module.exports = getViewTrendConfig
