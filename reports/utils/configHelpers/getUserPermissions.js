const getUserPermissions = reqBody => {
  // auth filters:
  let joeB = false

  const hasAuthFilters = reqBody.creds?.filters?.length > 0
  if (hasAuthFilters) {
    joeB = reqBody.creds.filters.find(f => f.dataName === 'jbBuyer').mandatory
  } else {
    // check for front end option
    if (reqBody.dataFilters === 'jbBuyer') joeB = true
  }

  return {
    joeB,
  }
}

module.exports = getUserPermissions
