const { subMonths, startOfDay, addDays } = require('date-fns')

const aging = [
  {
    start: 0,
    end: 3,
    heading: '< 3 mo.',
  },
  {
    start: 3,
    end: 6,
    heading: '3 - 6 mo.',
  },
  {
    start: 6,
    end: 9,
    heading: '6 - 9 mo.',
  },
  {
    start: 9,
    end: 12,
    heading: '9 - 12 mo.',
  },
  {
    start: 12,
    end: 15,
    heading: '12 - 15 mo.',
  },
  {
    start: 15,
    end: 18,
    heading: '15 - 18 mo.',
  },
  {
    start: 18,
    end: 21,
    heading: '18 - 21 mo.',
  },
  {
    start: 21,
    end: 24,
    heading: '21 - 24 mo.',
  },
  {
    start: 24,
    end: 99,
    heading: '> 24 mo.',
  },
]

const today = startOfDay(new Date())

aging.forEach((age, i) => {
  console.log(age.heading)
  const start = subMonths(today, age.start)
  console.log('start', start)

  const end = addDays(subMonths(today, age.end), 1)
  console.log('end', end)
  console.log('----------------')
})
