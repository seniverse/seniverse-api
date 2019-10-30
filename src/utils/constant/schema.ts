
import * as Joi from '@hapi/joi'

const BaseConfigSchema: Joi.SchemaMap = {
  key: Joi.string().required().not(''),
  uid: Joi.string().optional().allow(''),
  ttl: Joi.number().optional().allow(0),
  language: Joi.string().optional().allow(''),
  timeouts: Joi.array().items(Joi.number()).required(),
  encryption: Joi.boolean().optional(),
  cache: Joi.alternatives(
    Joi.object({
      max: Joi.number().required(),
      ttl: Joi.number().required(), /*seconds*/
      enabled: Joi.boolean().required().only(true)
    }),
    Joi.object({
      max: Joi.number().required(),
      ttl: Joi.string().required().only('auto'),
      enabled: Joi.boolean().required().only(true)
    }),
    Joi.object({
      max: Joi.number().optional(),
      ttl: Joi.number().optional(), /*seconds*/
      enabled: Joi.boolean().required().only(false)
    }),
  )
}

export const SeniverseConfigSchema = Joi.alternatives(
  // use key, uid, ttl to encryption
  Joi.object(BaseConfigSchema).keys({
    uid: Joi.string().required().not(''),
    ttl: Joi.number().required().not(0),
    encryption: Joi.boolean().required().only(true)
  }),
  // use key to call api
  Joi.object(BaseConfigSchema).keys({
    encryption: Joi.boolean().required().only(false)
  })
)
