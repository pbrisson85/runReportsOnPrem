const formatPostgresDateForSeasoftQuery = date => {
  console.log('date', date)

  date = date.split('/')
  // results in [month, day, year]

  console.log('date', date)
  console.log('date[0]', date[0])
  console.log('date[0].length', date[0].length)
  console.log('date[0].trim()', date[0].trim())
  console.log('date[0].trim().length', date[0].trim().length)

  const y = date[2]
  const m = date[0].length === 1 ? '0' + date[0] : date[0]
  const d = date[1].length === 1 ? '0' + date[1] : date[1]

  console.log('y', y)
  console.log('m', m)
  console.log('d', d)

  const formattedDate = `{d '${y}-${m}-${d}'}`

  console.log('formattedDate', formattedDate)

  // conver to {d 'yyyy-mm-dd'}

  return formattedDate
}

module.exports = formatPostgresDateForSeasoftQuery
