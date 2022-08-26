const envfile = import.meta.env

export const ENV_N2FREEVAS_API_DOMAIN = envfile.VITE_N2FREEVAS_API_DOMAIN.toString()
export const ENV_N2FREEVAS_API_KEY = envfile.VITE_N2FREEVAS_API_KEY.toString()
