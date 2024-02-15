export let SITE_URL: string
export let AUTH_URL: string

switch (process.env.NEXT_PUBLIC_ENVIRONMENT) {
	case 'production':
		SITE_URL = 'https://catholiccommunity.social'
		AUTH_URL = 'https://auth.catholiccommunity.social'
		break
	default:
		SITE_URL = 'http://localhost:3000'
		AUTH_URL = 'http://localhost:3002'
		break
}
