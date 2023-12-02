const getReportFormats = require('../../data/filters/getReportFormats')

const getBaseFormatDefault = () => {
  console.log('getBaseFormatDefault')
  const reportFormats = getReportFormats()

  const defaultFormat = reportFormats.filter(format => format.default)

  console.log('defaultFormat', defaultFormat)

  return defaultFormat
}

module.exports = getBaseFormatDefault
