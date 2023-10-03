const test1 = "\"[\"\"FG\"\",\"\"SECONDS\"\"]\"" //prettier-ignore

console.log('test1', test1)

const test2 = test1.replace(/""/g, '').replace(/"\[/g, '').replace(/\]"/g, '').split(',')

console.log('test2', test2)

const test3 = [...test1.replace(/""/g, '').replace(/"\[/g, '').replace(/\]"/g, '').split(',')]

console.log('test3', test3)
