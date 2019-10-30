
import * as Joi from '@hapi/joi'

const BaseConfigSchema: Joi.SchemaMap = {
  key: Joi.string().required().not(''),
  uid: Joi.string().optional().allow(''),
  ttl: Joi.number().optional().allow(0),
  language: Joi.string().optional().allow(''),
  timeouts: Joi.array().items(Joi.number()).optional(),
  encryption: Joi.boolean().optional(),
  cache: Joi.object({
    max: Joi.number(),
    ttl: Joi.number() /*seconds*/
  }).optional()
}

export const SeniverseConfigSchema = Joi.alternatives(
  // use key, uid, ttl to encryption
  Joi.object(BaseConfigSchema).keys({
    uid: Joi.string().required().not(''),
    ttl: Joi.number().required().not(0),
    encryption: Joi.boolean().required().only(true)
  }),
  // use key call api
  Joi.object(BaseConfigSchema).keys({
    encryption: Joi.boolean().required().only(false)
  })
)
