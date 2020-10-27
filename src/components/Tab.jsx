// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import React from 'react';
import './App.css';
import * as microsoftTeams from "@microsoft/teams-js";
import { List, Divider, Menu, Flex, FlexItem, Button } from '@fluentui/react-northstar'
import { EditIcon, SpeakerPersonIcon, TranslationIcon, DownloadIcon, CallRecordingIcon, MicOffIcon } from '@fluentui/react-icons-northstar'
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
      //alert(JSON.stringify(teamContext, null, 4));
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

  const fakeListContents = () => {
    const contents = Array.from([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
      i => (
        [{
          key: i,
          media: <SpeakerPersonIcon size="medium" />,
          header: `${userName.split('@')[0]} ${i}`,
          headerMedia: "7:26:56 AM",
          content: `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.${i}`,
          endMedia: <EditIcon size="small" />,
          style: { marginBottom: '3px' }
        },
        {
          key: i,
          media: <TranslationIcon size="medium" />,
          content: `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.${i}`,
        },
        <Divider color="brand" fitted />]
      )
    );
    const flatMap = [].concat.apply([], contents);
    return flatMap;
  }

  // const tightDivider = () => (
  //   <p
  //     style={{
  //       padding: '0',
  //       margin: '0',
  //     }}
  //   />
  // );

  return (
    <>
      <Flex
        gap="gap.small"
        styles={{ width: '315px' }}
        padding="padding.medium"
        column={true}
      >
        <FlexItem
          align='center'
        >
          <Menu defaultActiveIndex={0} items={items} pointing="start" primary />
        </FlexItem>
      </Flex>
      <Flex
        gap="gap.medium"
        styles={{ width: '315px', height: '80vh', overflowX: 'hidden', overflowY: 'auto' }}
        vAlign='start'
        column={true}
      >
        <List items={fakeListContents()} />
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