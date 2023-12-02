const getReportFormats = require('../../data/filters/getReportFormats')

const getBaseFormatDefault = () => {
  const reportFormats = getReportFormats()

  const defaultFormat = reportFormats.filter(format => format.default)

  return defaultFormat
}

module.exports = getBaseFormatDefault
