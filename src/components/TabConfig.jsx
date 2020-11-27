// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import React from 'react';
import './App.css';
import * as microsoftTeams from "@microsoft/teams-js";
import * as Config from './api/Constants';
import { Grid, Flex, Header, Text } from '@fluentui/react-northstar'
/**
 * The 'Config' component is used to display your group tabs
 * user configuration options.  Here you will allow the user to 
 * make their choices and once they are done you will need to validate
 * thier choices and communicate that to Teams to enable the save button.
 */
function TabConfig(props) {
  /**
   * The content url for the tab is a required value that must be set.
   * The url value is the source url for your configured tab.
   * This allows for the addition of query string parameters based on
   * the settings selected by the user.
   */

  /* eslint-disable no-unused-vars */
  const [displayName, setDisplayName] = React.useState(`AI-Caption (${Config.DISPLAY_NAME})`);
  const [contentUrl, setContentUrl] = React.useState(`${Config.CONTENT_URL}`);
  /* eslint-disable no-unused-vars */

  microsoftTeams.settings.setSettings({
    "contentUrl": `${contentUrl}/tab`,
    "suggestedDisplayName": displayName
  });

  // Active directory
  // var authTokenRequest = {
  //   successCallback: function (result) {
  //     console.log("Success: " + result);
  //     alert(result);
  //   },
  //   failureCallback: function (error) {
  //     console.log("Failure: " + error);
  //     alert(error);
  //   }
  // };
  // microsoftTeams.authentication.getAuthToken(authTokenRequest);

  /**
   * After verifying that the settings for your tab are correctly
   * filled in by the user you need to set the state of the dialog
   * to be valid.  This will enable the save button in the configuration
   * dialog.
   */
  microsoftTeams.settings.setValidityState(true);

  return (
    <>
      <Flex gap="gap.small" padding="padding.medium" style={{ backgroundColor: "white" }} column>
        <Flex.Item>
          <Header as="h3" content="Application Context Information" style={{ color: "black" }} />
        </Flex.Item>
        {/* 
        This is where you will add your tab configuration options the user
        can choose when the tab is added to your team/group chat.
       */}
      </Flex>

      <Grid
        styles={{
          gridTemplateColumns: '4fr 200px',
          justifyItems: 'start',
          alignItems: 'center',
          gap: '10px',
          backgroundColor: "white"
        }}
      >
        <Text weight="semibold" content="- Content URL" style={{ color: "black" }} />
        <Text style={{ color: 'black', display: 'inline-block', width: '200px' }} disabled content={`${contentUrl}`} />
        <Text weight="semibold" content="- App Name" style={{ color: "black" }} />
        <Text style={{ color: 'black' }} content={displayName} />
        <Text weight="semibold" content="- Copyright" style={{ color: "black" }} />
        <Text style={{ color: 'black', display: 'inline-block', width: '200px' }} disabled content={'Tata Consultancy Services Japan'} />
      </Grid>
    </>
  );
}

export default TabConfig;