export let SITE_URL: string

switch (process.env.NEXT_PUBLIC_ENVIRONMENT) {
	case 'production':
		SITE_URL = 'https://catholiccommunity.social'
		break
	default:
		SITE_URL = 'http://localhost:3000'
		break
}
