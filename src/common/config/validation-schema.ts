import Joi from 'joi';
import ConfigKey from './config-key';
import { DEFAULT_PORT } from '../constants';

export default Joi.object({
    [ConfigKey.NODE_ENV]: Joi.string(),
    [ConfigKey.PORT]: Joi.number().default(DEFAULT_PORT),
    [ConfigKey.VERSION]: Joi.string().required(),
    [ConfigKey.BASE_PATH]: Joi.string().required(),
    [ConfigKey.CORS_WHITELIST]: Joi.string().required(),
    [ConfigKey.TIMEZONE_DEFAULT_NAME]: Joi.string().required(),
    // OpenAI
    [ConfigKey.OPENAI_KEY]: Joi.string().required(),
    [ConfigKey.VECTOR_MODEL]: Joi.string().required(),
    // Pinecone
    [ConfigKey.PINECONE_KEY]: Joi.string().required(),
    [ConfigKey.PINECONE_DOCUMENT_INDEX]: Joi.string().required(),
});
