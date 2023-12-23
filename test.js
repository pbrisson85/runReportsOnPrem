const asynSim1 = async () => {
  // test in a loop

  const promises = []
  for (let i = 0; i < 5; i++) {
    promises.push(
      new Promise((resolve, reject) => {
        setTimeout(() => {
          console.log('asynSim1', i)

          resolve([
            { column: i, row: 'fish', sales: 1313 },
            { column: i, row: 'bread', sales: 75843 },
            { column: i, row: 'shampoo', sales: 98472 },
          ])
        }, 300)
      })
    )
  }

  const results = await Promise.all(promises)

  const reduced = results.reduce((acc, cur) => {
    return acc.concat(cur)
  }, [])

  return reduced
}

const asynSim2 = async () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log('asynSim2')

      resolve([
        { column: 'purchases', row: 'fish', sales: 3973 },
        { column: 'purchases', row: 'bread', sales: 912839 },
        { column: 'purchases', row: 'shampoo', sales: 493794 },
      ])
    }, 500)
  })
}

const asynSim3 = async () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log('asynSim3')

      resolve([
        { column: 'inventory', row: 'fish', sales: 32895 },
        { column: 'inventory', row: 'bread', sales: 90532 },
        { column: 'inventory', row: 'shampoo', sales: 154383 },
      ])
    }, 1000)
  })
}

async function routine() {
  const promises = []

  promises.push(asynSim1())
  promises.push(asynSim2())
  promises.push(asynSim3())

  const results = await Promise.all(promises)

  const reduced = results.reduce((acc, cur) => {
    return acc.concat(cur)
  }, [])

  console.log(reduced)

  // this proves the concept in the report routine. Pass the reduced into the mapSales and mapInven functions
}

routine()
