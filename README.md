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

- Set permission for initializing microphone, without a permission following message will be displayed.

    `Error occurred during microphone initialization: NotAllowedError: Permission denied`

```json
	"devicePermissions": [
		"media"
	],
```

- Refer to the structure of manifest.json, Developmet Preview.

    `https://raw.githubusercontent.com/OfficeDev/microsoft-teams-app-schema/preview/DevPreview/MicrosoftTeams.schema.json`

- Grant permission to install a custom app to your account

    `https://docs.microsoft.com/en-us/microsoftteams/platform/concepts/build-and-test/prepare-your-o365-tenant`

    `https://docs.microsoft.com/en-us/microsoftteams/platform/resources/dev-preview/developer-preview-intro#enable-developer-preview`

4) Set your in `.publish\manifest.json` as ngrok URL. In case of following line, it will be `https://d4fcc3cc15d8.ngrok.io`.

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

The upn attribute is deprecated. Instead of upn, use loginHint attribute.

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

6) Microsoft Administrator Account

    Administrator: tataKim@aicaption.onmicrosoft.com

    Teams Admin Site: https://admin.teams.microsoft.com/dashboard

    MS O365 developer dashborad: https://developer.microsoft.com/en-us/microsoft-365/profile/
    
    Spare Administrator Account: tataKim@subaicaption.onmicrosoft.com

    Test Account (subaicaption.onmicrosoft.com) : `boot2@@2`

6) Registering your app through the Azure Active Directory portal in-depth:

    https://docs.microsoft.com/en-us/microsoftteams/platform/tabs/how-to/authentication/auth-aad-sso 

    - important restrictions

    ```
    There are some important restrictions you should be aware of:

    - We only support user-level Microsoft Graph API permissions, i.e., email, profile, offline_access, OpenId. If you need access to other Microsoft Graph scopes (such as User.Read or Mail.Read), see our recommended workaround at the end of this documentation.
    - It's important that your application's domain name is the same as the domain name you've registering for your Azure AD application.
    - We don't currently support multiple domains per app.
    - We don't support applications that use the azurewebsites.net domain because it is too common and may be a security risk. However, we're actively seeking to remove this restriction.
    ```

6) Active Directory 

 - Directory (tenant) ID: 2d1ca593-e23f-4d06-a6df-9ca474f47838
 - Application (client) ID: 6ccb1a5c-3419-4cc5-bede-740b0dd0a78f

 - teams-ad-secret: _5gw~TY51qDDp-aOeLgTDYY7W.24gfWb9.

10) How to activate the app during the meeting

    https://github.com/OfficeDev/microsoft-teams-sample-meetings-token#step-6-sideload-the-app-in-a-teams-desktop-client

 - 1.Create a meeting with few test participants, ideally with a mix of Presenters and Attendees.
 - 2.Once meeting is created, go to the meeting details page and click on the "Add tab" (+) button.
 - 3.the pop-up that opens, click on "Manage apps".
 - 4.Click on "Upload a custom app" and upload the .zip file that was created in the previous steps. This adds the app to the meeting.
 - 5.Click on the "Add tab" button again. Now in the app selection page, the app should be visible as a "Meeting optimized tab".
 - 6.Select the AI-Caption app.
 - 7.Now the app will be visible in the meeting chat.
 - 8.Start the meeting and the icon should be visible in the meeting control bar.

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