// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import React from 'react';
import './App.css';
import * as microsoftTeams from "@microsoft/teams-js";
import { Menu, Flex, FlexItem, Text, Button } from '@fluentui/react-northstar'
import { TranslationIcon, DownloadIcon, CallRecordingIcon, MicOffIcon } from '@fluentui/react-icons-northstar'
/**
 * The 'GroupTab' component renders the main tab content
 * of your app.
 */
function Tab(props) {
  const [context, setContext] = React.useState({});

  React.useEffect(() => {
    // Get the user context from Teams and set it in the state
    microsoftTeams.getContext((teamContext, error) => {
      setContext(teamContext);
      alert(JSON.stringify(teamContext, null, 4));
    });
    // Next steps: Error handling using the error object
  }, [setContext])

  let userName = Object.keys(context).length > 0 ? context['upn'] : "";
  const items = [
    {
      key: 'english',
      content: '[EN] → [JP]',
      icon: <TranslationIcon />,
      styles: { backgroundColor: '#33344A', color: '#777786' }
    },
    {
      key: 'japanese',
      content: '[JP] → [EN]',
      icon: <TranslationIcon />,
      styles: { backgroundColor: '#33344A', color: '#777786' }
    },
  ]

  return (
    <>
      <Flex
        gap="gap.small"
        className="wrapper"
        padding="padding.medium"
        column={true}
      >
        <FlexItem
          align='center'
        >
          <Menu defaultActiveIndex={0} items={items} primary />
        </FlexItem>
        <FlexItem>
          <Text size="medium" content={`Congratulations ${userName}! The tab you made :-)`} />
        </FlexItem>
      </Flex>
      <Flex
        gap="gap.small"
        padding="padding.medium"
        styles={{ backgroundColor: '#33344A' }}
      >
        <FlexItem push>
          <Button icon={<DownloadIcon />} inverted iconOnly primary styles={{ backgroundColor: '#201F1F' }} />
        </FlexItem>
        <Button circular inverted content="+" iconOnly secondary styles={{ backgroundColor: '#201F1F' }} />
        <Button circular inverted content="-" iconOnly secondary styles={{ backgroundColor: '#201F1F' }} />
        <Button icon={<CallRecordingIcon />} inverted content="REC" primary styles={{ backgroundColor: '#C4314B', paddingLeftRightValue: 2 }} />
        <Button icon={<MicOffIcon />} inverted iconOnly primary styles={{ backgroundColor: '#2A4A51' }} />
      </Flex>
    </>
  );
}
export default Tab;