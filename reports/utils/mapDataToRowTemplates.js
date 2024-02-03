const _ = require('lodash')

const mapDataToRowTemplates = (data, rowTemplate, config, viewTrend) => {
  // build mapping key

  const rowTemplateCache = _.cloneDeep(rowTemplate)

  data.forEach(line => {
    // BUILD KEP MAP
    let keyMap = null

    if (viewTrend) {
      // trend should only map by l1_label
      keyMap = line.l1_label
    } else {
      // Build key to map

      for (let i = 0; i < config.baseFormat.groupingLevel; i++) {
        let filter = line[`l${i + 1}_label`]

        // build composite key for unflatten:
        keyMap = keyMap !== null ? `${keyMap}-${filter}` : `${filter}`
      }
    }

    if (!rowTemplateCache[keyMap]) {
      console.log('there is no row for :', line)
      return
    }

    rowTemplateCache[keyMap] = {
      ...rowTemplateCache[keyMap],
      [line.column]: {
        ...line,
      },
    }
  })

  return rowTemplateCache
}

module.exports = mapDataToRowTemplates
