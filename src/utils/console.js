const basicStyle = 'color: #fff; font-weight: bold;'
export function consoleStart(title) {
  console.log(
    '%c ● START ::: %c ' + title,
    basicStyle + 'background-color: green;',
    ''
  )
}
export function consoleEnd(title) {
  console.log(
    '%c ○ END   ::: %c ' + title,
    basicStyle + 'background-color: red;',
    ''
  )
}
export function consoleChange(title, content) {
  console.log(
    '✨ %c CHANGE ::: %c ' + title,
    basicStyle + 'background-color: orange',
    '',
    content
  )
}
