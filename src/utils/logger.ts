
import { configure, getLogger } from 'log4js'
import config from '../config'

configure(config.logger)
const logger = getLogger(config.logger.categories.default.appenders[0])
logger.level = config.logger.categories.default.level

export default logger
