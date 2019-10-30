
const space = '\t'

const _print = (dict: any, prefix = '') => {
  if (Array.isArray(dict)) return dict.map(item => _print(item, prefix)).join('\n')
  if (!dict || typeof dict !== 'object') return `${prefix}${dict}`
  if (Object.keys(dict).length === 0) return `${prefix}${JSON.stringify(dict)}`
  const list = []

  for (const key of Object.keys(dict)) {
    const data = dict[key]
    if (typeof data === 'string') {
      list.push(`${prefix}[${key}] ${data}`)
    } else if (Array.isArray(data)) {
      const tmp = data.map(item => _print(item, `${prefix}${space}`)).join('\n')
      list.push(`${prefix}[${key}]\n${tmp}`)
    } else if (data && typeof data === 'object') {
      list.push(`${prefix}[${key}]\n${_print(data, `${prefix}${space}`)}`)
    } else {
      list.push(`${prefix}[${key}] ${data}`)
    }
  }
  return list.join('\n')
}

const print = (dict: any, output = console.log) => {
  try {
    output(_print(dict))
  } catch (e) {
    console.error(e)
  }
}

export default {
  print
}
