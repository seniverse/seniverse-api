
import * as fs from 'fs'
import * as path from 'path'
import logger from '../utils/logger'

/*
* convert string from uppercase to lowercase with connection
* for example, using connection = '_'
* hourlyHistory -> hourly_history
*/
export const stringConvertToLowercase = (connection: string = '_') => (raw: string): string => {
  const words = raw.split(/[A-Z]/)
  let currentIndex = 0
  let resultKey = ''
  let emptyBefore = words[0] === ''

  for (let i = 0; i < words.length; i += 1) {
    const word = words[i]
    if (currentIndex >= raw.length) break
    const letter = raw[currentIndex].toLowerCase()
    let formattedWord = ''

    if (emptyBefore) {
      formattedWord = word || letter
    } else {
      formattedWord = i === 0 ? word : `${letter}${word}`
    }

    resultKey += (!resultKey || (emptyBefore && word))
      ? formattedWord
      : `${connection}${formattedWord}`
    currentIndex += formattedWord.length

    if (word) emptyBefore = false
  }
  return resultKey
}

const isExcluded = (regexps: Array<RegExp|string>, filename: string, fullpath: string): boolean => {
  for (const regexp of regexps) {
    if (regexp instanceof RegExp && regexp.test(filename)) {
      return true
    }
    if (regexp === fullpath) return true
  }
  return false
}

export const shadowImport = (folder: string, options: {
  prefix: string
  excludes: Array<RegExp|string>
  nameFormatter?: (name: string, module: any) => string
  requiredExports: string[]
  exportDefault: boolean
  extend?: (pathes: string[], module: any) => any
}): Map<symbol, any> => {
  const {
    prefix,
    extend,
    excludes = [],
    nameFormatter,
    requiredExports,
    exportDefault = true,
  } = options

  return fs.readdirSync(folder)
    .filter(
      name => !isExcluded(excludes, name, path.resolve(folder, name))
    )
    .reduce((list, name) => {
      const filepath = path.resolve(folder, name)
      if (fs.statSync(filepath).isDirectory()) {
        const exportedData = shadowImport(
          filepath,
          Object.assign({}, options, {
            prefix: `${prefix}.${name}`
          })
        )
        return [
          ...list,
          ...exportedData.entries()
        ]
      }

      try {
        const filename = name.split('.').slice(0, -1).join('.')
        logger.debug(`prefix: ${prefix}, filepath: ${filepath}`)
        let Module = require(filepath)

        if (exportDefault) Module = Module.default
        for (const requiredExport of requiredExports) {
          if (Module[requiredExport] === undefined) {
            throw new Error(`Module.${requiredExport} missing for ${filepath}`)
          }
        }
        if (!Module) throw new Error(`Module missing for ${filepath}`)

        const key = nameFormatter ? nameFormatter(filepath, Module) : `${prefix}.${filename}`
        list.push([
          Symbol.for(key),
          extend
            ? extend([...prefix.split('.'), filename], Module)
            : Module
        ])
        logger.info(`Module ${filepath} load as ${key}`)
      } catch (e) {
        logger.error(e)
      } finally {
        return list
      }
    }, []).reduce((map, data) => {
      map.set(data[0], data[1])
      return map
    }, new Map() as Map<symbol, any>)
}