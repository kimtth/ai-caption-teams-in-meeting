# In-Meeting App Sidepanel (Tabs)

Meeting apps will be hosted in the top upper bar of the chat window and as in-meeting tab experience via the in-meeting tab. When users add a tab to a meeting through the tab gallery, apps that are during meeting experiences will be surfaced.

1) Enable custom Teams apps and turn on custom app uploading

    https://docs.microsoft.com/en-us/microsoftteams/platform/resources/dev-preview/developer-preview-intro

1) Enable developer preview

1) In your app manifest add sidePanel to the context array 

```json
    "configurableTabs": [
        {
            "configurationUrl": "{baseUrl0}/config",
            "canUpdateConfiguration": true,
            "scopes": [
                "team",
                "groupchat"
            ],
            "context":[
                "meetingChatTab",
                "meetingDetailsTab",
                "meetingSidePanel"
            ]
        }
    ],
```

4) Set your `baseUrl0` in `.publish\Development.env` as ngrok URL. In case of following line, it will be `https://d4fcc3cc15d8.ngrok.io`.

```powershell
ngrok by @inconshreveable                                                                               (Ctrl+C to quit)

Session Status                online
Session Expires               3 hours, 54 minutes
Version                       2.3.35
Region                        United States (us)
Web Interface                 http://127.0.0.1:4040
Forwarding                    http://d4fcc3cc15d8.ngrok.io -> http://localhost:3000
Forwarding                    https://d4fcc3cc15d8.ngrok.io -> http://localhost:3000

Connections                   ttl     opn     rt1     rt5     p50     p90
                              268     0       0.00    0.03    5.31    23.75
```

5) TeamContext Sample

```json
{
    "chatId": "19:90dc7f746e344292840e729faf4e5b8d@thread.tacv2",
    "frameContext": "sidePanel",
    "glassjarBaseUrl": null,
    "hostClientType": "desktop",
    "isMultiWindow": true,
    "locale": "en-us",
    "loginHint": "tataKim@xxxxx.onmicrosoft.com",
    "meetingId": "MCMxOTo5MGRjN2Y3NDZlMzQ0MjkyODQwZTcyOWZhZjRlNWI4ZEB0aHJlYWQudGFjdjIjMA==",
    "ringId": "ring3_6",
    "theme": "dark",
    "tid": "1711e6ab-8fd2-4421-8fdf-a017e9cb7cc6",
    "upn": "tataKim@xxxxx.onmicrosoft.com",
    "userObjectId": "626589be-012a-4e0b-9ea7-43ea072a56a0",
    "userPrincipalName": "tataKim@xxxxx.onmicrosoft.com"
}
```
6) Fluent UI (North Star)

    `https://fluentsite.z22.web.core.windows.net/`

## Prerequisites
-  [NodeJS](https://nodejs.org/en/)

-  [M365 developer account](https://docs.microsoft.com/en-us/microsoftteams/platform/concepts/build-and-test/prepare-your-o365-tenant) or access to a Teams account with the appropriate permissions to install an app.

## Build and Run

In the project directory, execute:

`npm install`

`npm start`

## Deploy to Teams

### `ngrok http http://localhost:3000`
Run ngrok so there is a tunnel from the Internet to localhost:3000.
[Setting up ngrok for Teams apps](https://aka.ms/VSTeamsExtensionSetupNgrok)

#### Update Development.env
Update manifest.env in the .publish folder as follows:
* baseUrl0=*somesubdomain*.ngrok.io // somesubdomain should be the subdomain in the fowarding URL provided by ngrok. 

**Upload app from the Teams client**
- Upload the `Development.zip` from the *.publish* folder to Teams.
  - [Upload a custom app](https://aka.ms/teams-toolkit-uploadapp) 