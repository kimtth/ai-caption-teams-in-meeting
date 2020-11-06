// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import React from 'react';
import './App.css';
import * as microsoftTeams from "@microsoft/teams-js";
import { List, Divider, Menu, Flex, FlexItem, Button } from '@fluentui/react-northstar'
import { EditIcon, SpeakerPersonIcon, TranslationIcon, DownloadIcon, CallRecordingIcon, MicOffIcon } from '@fluentui/react-icons-northstar'
//import { Virtuoso } from "react-virtuoso";
import * as Config from './api/Constants';
import { TextTranslator, SpeechToTextContinualStart, SpeechToTextContinualStop } from './api/SpeechAPI';
/**
 * The 'GroupTab' component renders the main tab content
 * of your app.
 */
function Tab(props) {
  const [context, setContext] = React.useState({});
  const [fontSize, setFontSize] = React.useState(12);
  const [continualRecDisable, setContinualRecDisable] = React.useState(false);
  const [recognizer, setRecognizer] = React.useState();
  const [tabValue, setTabValue] = React.useState(0);
  /* eslint-disable no-unused-vars */
  const [primarySpeechlanguage, setPrimarySpeechlanguage] = React.useState(Config.SPEECH_INITIAL_PRIMARY_LANGUAGE);
  const [primaryTranslatelanguage, setPrimaryTranslatelanguage] = React.useState(Config.TRANSLATE_INITIAL_PRIMARY_LANGUAGE);
  const [secondarySpeechlanguage, setSecondarySpeechlanguage] = React.useState(Config.SPEECH_INITIAL_SECONDARY_LANGUAGE);
  const [secondaryTranslatelanguage, setSecondaryTranslatelanguage] = React.useState(Config.TRANSLATE_INITIAL_SECONDARY_LANGUAGE);
  /* eslint-disable no-unused-vars */

  React.useEffect(() => {
    // Get the user context from Teams and set it in the state
    microsoftTeams.getContext((teamContext, error) => {
      setContext(teamContext);
      //alert(JSON.stringify(teamContext, null, 4));
    });
    // Next steps: Error handling using the error object
  }, [setContext])

  let userName = Object.keys(context).length > 0 ? context['upn'] : "";

  const handleLanguage = (e) => {
    alert(e.target.id)
    const id = e.target.id;

    if(id === 'en'){
      setTabValue(0);
    } else {
      setTabValue(1);
    }
  }

  const items = [
    {
      key: 'english',
      id: 'en',
      content: '[EN] → [JP]',
      icon: <TranslationIcon />,
      onClick: {handleLanguage}
    },
    {
      key: 'divider-1',
      kind: 'divider'
    },
    {
      key: 'japanese',
      id: 'ja',
      content: '[JP] → [EN]',
      icon: <TranslationIcon />,
      onClick: {handleLanguage}
    },
  ]

  const fakeListContents = () => {
    const contents = Array.from([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
      i => (
        [{
          key: i,
          media: <SpeakerPersonIcon size="medium" />,
          header: `${userName} ${i}`,
          headerMedia: "7:26:56 AM",
          content: `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.${i}`,
          endMedia: <EditIcon size="small" />,
          style: { marginBottom: '3px' }
        },
        {
          key: i,
          media: <TranslationIcon size="medium" />,
          content: `
          Lorem ipsum dolorは、労苦と悲しみ、eiusmodを行うためのいくつかの重要なことを行うために、アメット、consectetur adipiscing elit、sed tempor、vitaryに座っています.`,
        },
        <Divider color="brand" fitted />]
      )
    );
    const flatMap = [].concat.apply([], contents);
    return flatMap;
  }

  const handleDownloadEvent = () => {
    alert('triggered');
  }

  const fontSizeUp = () => {
    if (fontSize < 24) {
      let newFontSize = fontSize + 2;
      setFontSize(newFontSize);
    }
  }

  const fontSizeDown = () => {
    if (fontSize > 3) {
      let newFontSize = fontSize - 2;
      setFontSize(newFontSize);
    }
  }

  const errorHandler = () => {
    setContinualRecDisable(false);
    StopRecord();
  }

  const RecordCallback = (lang, result) => {
    if (secondarySpeechlanguage.includes(lang)) {
      addTranslateSecondTab(result);
    } else {
      addTranslateFirstTab(result);
    }
  }

  const addTranslateFirstTab = (bufferString) => {
    TextTranslator(primaryTranslatelanguage, secondaryTranslatelanguage, bufferString, (translate) => {
      alert(translate);
    })
  }

  const addTranslateSecondTab = (bufferString) => {
    TextTranslator(secondaryTranslatelanguage, primaryTranslatelanguage, bufferString, (translate) => {
      alert(translate);
    })
  }

  const ContinualRecord = () => {
    setContinualRecDisable(true);

    let speechLang = primarySpeechlanguage;
    if (tabValue === 1) {
      speechLang = secondarySpeechlanguage
    }

    SpeechToTextContinualStart(speechLang, setRecognizer, (lang, result) => {
      RecordCallback(lang, result);
    }, errorHandler);
  }

  const StopRecord = () => {
    if (continualRecDisable) {
      SpeechToTextContinualStop(recognizer, () => {
        setContinualRecDisable(false);
      });
    }
  }

  return (context.frameContext !== 'sidePanel' ?
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
          <Menu defaultActiveIndex={0} items={items} pointing="start" />
        </FlexItem>
      </Flex>
      <Flex
        gap="gap.medium"
        styles={{ width: '315px', height: '78vh', overflowX: 'hidden', overflowY: 'auto' }}
        vAlign='start'
        column={true}
      >
        <List
          items={fakeListContents()}
          truncateHeader={true}
          variables={{
            contentFontSize: `${fontSize}px`
          }}
        />
      </Flex>
      <Flex
        gap="gap.small"
        padding="padding.medium"
        styles={{ backgroundColor: '#33344A' }}
      >
        <FlexItem push>
          <Button icon={<DownloadIcon />} inverted iconOnly primary styles={{ backgroundColor: '#201F1F' }} onClick={handleDownloadEvent} />
        </FlexItem>
        <Button circular inverted content="+" iconOnly secondary styles={{ backgroundColor: '#201F1F' }} onClick={fontSizeUp} />
        <Button circular inverted content="-" iconOnly secondary styles={{ backgroundColor: '#201F1F' }} onClick={fontSizeDown} />
        <Button icon={<CallRecordingIcon />} inverted content="REC" primary styles={{ backgroundColor: '#C4314B', paddingLeftRightValue: 2 }} disabled={continualRecDisable} onClick={ContinualRecord} />
        <Button icon={<MicOffIcon />} inverted iconOnly primary styles={{ backgroundColor: '#2A4A51' }} onClick={StopRecord} />
      </Flex>
    </>
    : "HoHoHo !!"
  );
}
export default Tab;