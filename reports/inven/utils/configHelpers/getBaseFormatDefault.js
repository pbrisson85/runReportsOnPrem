const getReportFormats = require('../../data/filters/getReportFormats')

const getBaseFormatDefault = () => {
  const reportFormats = getReportFormats()

  const defaultFormat = reportFormats.filter(format => format.default)

  return defaultFormat[0] // should only be one default
}

module.exports = getBaseFormatDefault
