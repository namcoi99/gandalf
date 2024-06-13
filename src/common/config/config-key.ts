enum ConfigKey {
    NODE_ENV = 'NODE_ENV',
    PORT = 'PORT',
    VERSION = 'VERSION',
    BASE_PATH = 'BASE_PATH',
    CORS_WHITELIST = 'CORS_WHITELIST',
    TIMEZONE_DEFAULT_NAME = 'TIMEZONE_DEFAULT_NAME',
    // Firebase
    GOOGLE_FIREBASE_APPLICATION_CREDENTIALS = 'GOOGLE_FIREBASE_APPLICATION_CREDENTIALS',
    // OpenAI
    OPENAI_KEY = 'OPENAI_KEY',
    VECTOR_MODEL = 'VECTOR_MODEL',
    // Pinecone
    PINECONE_KEY = 'PINECONE_KEY',
    PINECONE_DOCUMENT_INDEX = 'PINECONE_DOCUMENT_INDEX',
}

export default ConfigKey;
