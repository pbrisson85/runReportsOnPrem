const formatPostgresDateForSeasoftQuery = date => {
  date = date.split('/')
  // results in [month, day, year]

  const y = date[2].trim()
  const m = date[0].trim().length === 1 ? '0' + date[0].trim() : date[0].trim()
  const d = date[1].trim().length === 1 ? '0' + date[1].trim() : date[1].trim()

  const formattedDate = `{d '${y}-${m}-${d}'}`

  // conver to {d 'yyyy-mm-dd'}

  return formattedDate
}

module.exports = formatPostgresDateForSeasoftQuery
