const formatPostgresDateForSeasoftQuery = date => {
  date = date.split('/')
  // results in [month, day, year]

  const y = date[2]
  const m = date[0].length === 1 ? '0' + date[0] : date[0]
  const d = date[1].length === 1 ? '0' + date[1] : date[1]
  const formattedDate = `{d '${y}-${m}-${d}'}`

  // conver to {d 'yyyy-mm-dd'}

  return formattedDate
}

module.exports = formatPostgresDateForSeasoftQuery
