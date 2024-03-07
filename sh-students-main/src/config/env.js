export const env = {
	PORT: process.env.PORT,
    NODE_ENV: process.env.NODE_ENV,
    VERSION: process.env.VERSION ? +process.env.VERSION : 1,
    APP_DOMAIN: process.env.APP_DOMAIN,
}
