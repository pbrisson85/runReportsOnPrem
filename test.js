console.log(JSON.stringify(['FG', 'RM']))

let test1 = "\"[\"\"FG\"\"]\"" //prettier-ignore

console.log(test1)

test1 = [...test1.replace(/""/g, '').replace(/"\[/g, '').replace(/\]"/g, '').split(', ')]

console.log(test1)
