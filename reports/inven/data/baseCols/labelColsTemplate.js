const getLabelColsTemplate = require('../../../utils/labelColsTemplate')

const fetchLabelColsTemplate = () => {
  const template = getLabelColsTemplate()

  return template
}

module.exports = fetchLabelColsTemplate
