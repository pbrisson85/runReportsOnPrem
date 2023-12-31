const arr = [
  { default_start: false, default_end: false, id: 1 },
  { default_start: false, default_end: true, id: 2 },
  { default_start: true, default_end: false, id: 3 },
  { default_start: false, default_end: false, id: 4 },
]

const defaultStart = arr.find(a => a.default_start)?.id
