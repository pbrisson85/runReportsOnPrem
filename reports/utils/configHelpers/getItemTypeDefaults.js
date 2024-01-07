const getItemTypeDefaults_sales = require('../../filters/data/getItemTypeDefaults_sales')
const getItemTypeDefaults_inven = require('../../filters/data/getItemTypeDefaults_inven')
const getItemTypeDefaults_production = require('../../filters/data/getItemTypeDefaults_production')

const getItemTypeDefaults = module => {
  let itemTypes

  switch (module) {
    case 'inven':
      itemTypes = getItemTypeDefaults_inven()
      break
    case 'sales':
      itemTypes = getItemTypeDefaults_sales()
      break
    case 'production':
      itemTypes = getItemTypeDefaults_production()
      break
  }

  return itemTypes
}

module.exports = getItemTypeDefaults
