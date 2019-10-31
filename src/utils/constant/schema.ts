
import * as Joi from '@hapi/joi'

export const EncryptSchema = Joi.object({
  key: Joi.string().required().not(''),
  uid: Joi.string().required().not(''),
  ttl: Joi.number().required().not(0),
  enabled: Joi.boolean().required().only(true)
})

const BaseConfigSchema: Joi.SchemaMap = {
  encryption: Joi.alternatives(
    EncryptSchema,
    Joi.object({
      key: Joi.string().required().not(''),
      uid: Joi.string().optional().allow(''),
      ttl: Joi.number().optional().allow(0),
      enabled: Joi.boolean().required().only(false)
    }),
  ),
  query: Joi.object({
    unit: Joi.string().optional().valid('c', 'f', ''),
    language: Joi.string().optional().valid(
      'zh-Hans',
      'zh-Hant',
      'en',
      'ja',
      'de',
      'fr',
      'es',
      'pt',
      'hi',
      'id',
      'ru',
      'th',
      'ar',
      ''
    ),
    location: Joi.string().optional().allow(''),
    timeouts: Joi.array().items(Joi.number()).required(),
  }),
  returnRaw: Joi.boolean().required(),
  cache: Joi.alternatives(
    Joi.object({
      max: Joi.number().required().not(0),
      ttl: Joi.number().required().not(0), /*seconds*/
      enabled: Joi.boolean().required().only(true)
    }),
    Joi.object({
      max: Joi.number().required().not(0),
      ttl: Joi.string().required().only('auto'),
      enabled: Joi.boolean().required().only(true)
    }),
    Joi.object({
      max: Joi.number().optional().allow(0),
      ttl: Joi.number().optional().allow(0), /*seconds*/
      enabled: Joi.boolean().required().only(false)
    }),
  )
}

export const SeniverseConfigSchema = Joi.object(BaseConfigSchema)
