const process = async () => {
  const promises = []

  const func1 = string => {
    return [string]
  }

  const func2 = string => {
    return [string]
  }

  const func3 = string => {
    return [string]
  }

  promises.push(func1('func1'))
  promises.push(func2('func2'))
  promises.push(func3('func3'))

  console.log(promises)

  const results = await Promise.all(promises)

  let final = []
  results.forEach(result => {
    final = [...final, ...result]
  })

  console.log(final)
}

process()
