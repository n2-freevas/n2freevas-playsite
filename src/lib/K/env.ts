// @ts-nocheck
const envfile = import.meta.env
type Env = "dev" | "prod"
export const ENV:Env = envfile.VITE_ENV ?? "prod"
export const ENV_N2FREEVAS_API_DOMAIN: string = envfile.VITE_N2FREEVAS_API_DOMAIN
export const ENV_N2FREEVAS_API_KEY: string = envfile.VITE_N2FREEVAS_API_KEY
export const ENV_SYNEGIER_ADMIN_ACCESS_TOKEN :string = envfile.VITE_SYNEGIER_ADMIN_ACCESS_TOKEN
