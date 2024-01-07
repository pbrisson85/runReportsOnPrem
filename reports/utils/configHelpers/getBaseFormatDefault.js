const getReportFormats_sales = require('../../filters/data/getReportFormats_sales')
const getReportFormats_inven = require('../../filters/data/getReportFormats_inven')
const getReportFormats_production = require('../../filters/data/getReportFormats_production')

const getBaseFormatDefault = module => {
  let reportFormats

  switch (module) {
    case 'inven':
      reportFormats = getReportFormats_inven()
      break
    case 'sales':
      reportFormats = getReportFormats_sales()
      break
    case 'production':
      reportFormats = getReportFormats_production()
      break
    default:
      reportFormats = getReportFormats_sales()
      break
  }

  const defaultFormat = reportFormats.filter(format => format.default)

  return defaultFormat[0] // should only be one default
}

module.exports = getBaseFormatDefault
