//Azure
export const SPEECH_SUBSCRIPTION_KEY = 'cd7b9bbe842347859d1e5d1e88b1f507' 
export const SPEECH_SERVICE_REGION = 'japaneast' //'japaneast' or 'westus' etc

export const TRANSLATOR_TEXT_SUBSCRIPTION_KEY = '54ad8c07ce4a436585765cd2eb3e95b9'
export const TRANSLATOR_TEXT_ENDPOINT = 'https://api.cognitive.microsofttranslator.com'
export const TRANSLATOR_TEXT_REGION_AKA_LOCATION = 'eastasia'

//prod
export const APPLICATION_ID = '8f92afc0-55a3-41b6-826b-03636cec0330'
export const TENANT_ID = '2d1ca593-e23f-4d06-a6df-9ca474f47838'

//dev
export const CONTENT_URL = 'https://ai-caption-teams.azurewebsites.net'

//Application
export const TITLE_SAVE_ONE = '<議事録(Minutes)> \r\n'//'1.[English -> 日本語] \r\n'
export const TITLE_BACKTRACK = '[Shadow Tracking] \r\n'
export const SAVE_FILE_NAME = 'voice-text-save-'
export const SAVE_FILE_EXTENSION = '.txt'

export const SPEECH_INITIAL_PRIMARY_LANGUAGE = ['en-US','en-IN','en-GB']
export const SPEECH_INITIAL_SECONDARY_LANGUAGE = ['ja-JP']
export const TRANSLATE_INITIAL_PRIMARY_LANGUAGE = 'en'
export const TRANSLATE_INITIAL_SECONDARY_LANGUAGE  = 'ja'

export const WARNING_NOT_EDITABLE = 'Welcome Message is not editable.'
export const NOTICE_SHARE = 'Please share the channel ID for a subscriber.'
export const REFRESH_MSG = 'Your network could have disconnected for a while. The browser should be refreshed (F5).'

export const DEV_MODE = process.env.NODE_ENV !== "production"? true: false; //kim: development or production
export const DEV_PORT = DEV_MODE ? '8080': ''
export const SocketURL = DEV_MODE? `http://${window.location.hostname}:${DEV_PORT}`:""
export const API_URL = DEV_MODE ? `http://localhost:${DEV_PORT}`: ""