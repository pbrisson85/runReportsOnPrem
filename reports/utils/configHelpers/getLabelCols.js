const getLabelColsTemplate = require('./labelColsTemplate')
const getBaseFormatDefault = require('./getBaseFormatDefault')

const getLabelCols = reqBody => {
  const cols = reqBody.reportFormat?.labelCols ?? getBaseFormatDefault().labelCols
  const template = getLabelColsTemplate()

  const labelCols = cols.map(col => {
    return { ...template, ...col }
  })

  return labelCols
}

module.exports = getLabelCols
