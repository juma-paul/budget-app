import merge from 'lodash.merge'

process.env.NODE_ENV = process.env.NODE_ENV || 'development'
const stage = process.env.STAGE || 'local'

let envConfig

if (stage === 'production') {
    envConfig = ( await import('./local.js')).default
} else if (stage === 'test') {
    envConfig = (await import('./test.js')).default
} else {
    envConfig = (await import('./local.js')).default
}

const defaultConfigs = {
    stage,
    env: process.env.NODE_ENV,
    port: 8734,
    secrets: {
        jwt: process.env.JWT_SECRET,
        dbUrl: process.env.DATABASE_URL
    }
}

export const configs = merge(defaultConfigs, envConfig)

