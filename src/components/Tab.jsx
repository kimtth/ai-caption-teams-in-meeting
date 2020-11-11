// Copyright (c) TCS Japan Corporation. All rights reserved.

import React from 'react';
import './App.css';
import * as microsoftTeams from "@microsoft/teams-js";
import { List, ListItem, Divider, Tooltip, TextArea, Dialog, Menu, MenuItem, Flex, FlexItem, Button } from '@fluentui/react-northstar'
import { EditIcon, SpeakerPersonIcon, TranslationIcon, DownloadIcon, CallRecordingIcon, MicOffIcon } from '@fluentui/react-icons-northstar'
import * as Config from './api/Constants';
import Conversation from './chat/Conversation';
import { saveTextArea } from './util/Util'
import { TextTranslator, SpeechToTextContinualStart, SpeechToTextContinualStop } from './api/SpeechAPI';

function Tab(props) {
  const [context, setContext] = React.useState({});
  const [fontSize, setFontSize] = React.useState(14);
  const [continualRecDisable, setContinualRecDisable] = React.useState(false);
  const [recognizer, setRecognizer] = React.useState();
  const [tabValue, setTabValue] = React.useState(0);
  /* eslint-disable no-unused-vars */
  const [primarySpeechlanguage, setPrimarySpeechlanguage] = React.useState(Config.SPEECH_INITIAL_PRIMARY_LANGUAGE);
  const [primaryTranslatelanguage, setPrimaryTranslatelanguage] = React.useState(Config.TRANSLATE_INITIAL_PRIMARY_LANGUAGE);
  const [secondarySpeechlanguage, setSecondarySpeechlanguage] = React.useState(Config.SPEECH_INITIAL_SECONDARY_LANGUAGE);
  const [secondaryTranslatelanguage, setSecondaryTranslatelanguage] = React.useState(Config.TRANSLATE_INITIAL_SECONDARY_LANGUAGE);
  /* eslint-disable no-unused-vars */
  const conversationItem = new Conversation('Welcome to access', 'Hi There!', 'こんにちは。');
  const [conversationList, setConversationList] = React.useState([conversationItem]);
  const [userId, setUserId] = React.useState('');
  const [meetingId, setMeetingId] = React.useState('');

  const [tooltipContent, setTooltipContent] = React.useState('');
  const [tooltipOpen, setTooltipOpen] = React.useState(false);
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [dialogKey, setDialogKey] = React.useState('');
  const [dialogContent, setDialogContent] = React.useState('');
  const [noticeOpen, setNoticeOpen] = React.useState(false);
  const messagesEndRef = React.useRef(null);

  React.useEffect(() => {
    // Get the user context from Teams and set it in the state
    microsoftTeams.getContext((teamContext, error) => {
      setContext(teamContext);
      //alert(JSON.stringify(teamContext, null, 4));
      const userId = Object.keys(teamContext).length > 0 ? teamContext['loginHint'] : "";
      const meetingId = Object.keys(teamContext).length > 0 ? teamContext['meetingId'] : "";
      setUserId(userId);
      setMeetingId(meetingId);
    });
  }, [])

  React.useEffect(() => {
    if (messagesEndRef.current)
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
  }, [conversationList])

  const handleMode = (mode) => {
    setTabValue(mode);
  }

  const handelEdit = (key, content) => {
    setDialogKey(key);
    setDialogContent(content);
    setDialogOpen(true);
  }

  const onDialogCancel = () => {
    setDialogOpen(false);
    setNoticeOpen(false);
  }

  const onDialogConfirm = () => {
    const index = indexOfItem(conversationList, dialogKey);
    if (index === -1) {
      console.log('The index of item is not found');
      return;
    }
    const conversationItem = conversationList[index];

    let srcLanguage = primaryTranslatelanguage;
    let targetLanguage = secondaryTranslatelanguage;
    if(tabValue === 1){
      srcLanguage = secondaryTranslatelanguage;
      targetLanguage = primaryTranslatelanguage;
    }

    TextTranslator(srcLanguage, targetLanguage, dialogContent, (translate) => {
      conversationItem.content = dialogContent;
      conversationItem.translateContent = translate;
      conversationList[index] = conversationItem;
      setConversationList(conversationList);
      setDialogOpen(false);
    })
  }

  const onChangeTextArea = (e) => {
    setDialogContent(e.target.value);
  }

  const indexOfItem = function (target, value) {
    const index = target.map(function (e) {
      return e.key;
    }).indexOf(value);
    return index;
  }

  const handleDownloadEvent = () => {
    saveTextArea(meetingId, conversationList);
    setNoticeOpen(true);
  }

  const fontSizeUp = () => {
    if (fontSize < 30) {
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

  const addTranslateFirstTab = (content) => {
    TextTranslator(primaryTranslatelanguage, secondaryTranslatelanguage, content, (translate) => {
      const conversationItem = new Conversation(userId, content, translate);
      setConversationList(conversationList => [...conversationList, conversationItem])
      setTooltipOpen(false);
    })
  }

  const addTranslateSecondTab = (content) => {
    TextTranslator(secondaryTranslatelanguage, primaryTranslatelanguage, content, (translate) => {
      const conversationItem = new Conversation(userId, content, translate);
      setConversationList(conversationList => [...conversationList, conversationItem]);
      setTooltipOpen(false);
    })
  }

  const realtimeTooltip = (content) => {
    setTooltipOpen(true);
    setTooltipContent(content);
  }

  const ContinualRecord = () => {
    setContinualRecDisable(true);
    let speechLang = primarySpeechlanguage;
    if (tabValue === 1) {
      speechLang = secondarySpeechlanguage
    }

    SpeechToTextContinualStart(speechLang, setRecognizer, realtimeTooltip, (lang, result) => {
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
      <Dialog
        open={noticeOpen}
        confirmButton="Confirm"
        onConfirm={onDialogCancel}
        content={'Download Completed.'}
      />
      <Dialog
        open={dialogOpen}
        cancelButton="Cancel"
        confirmButton="Confirm"
        onCancel={onDialogCancel}
        onConfirm={onDialogConfirm}
        content={<TextArea
          placeholder="Type here..."
          onChange={onChangeTextArea}
          value={dialogContent}
          styles={{ width: '98%', height: '150px' }} />}
        header="Please edit here."
        closeOnOutsideClick={false}
      />
      <Flex
        gap="gap.small"
        styles={{ width: '315px' }}
        padding="padding.medium"
        column={true}
      >
        <FlexItem
          align='center'
        >
          <Menu defaultActiveIndex={0} activeIndex={tabValue} pointing="end">
            <MenuItem index={0} key='english' id='en' content='[EN] → [JP]' icon={<TranslationIcon />} onClick={() => handleMode(0)} />
            <Divider />
            <MenuItem index={1} key='japanese' id='ja' content='[JP] → [EN]' icon={<TranslationIcon />} onClick={() => handleMode(1)} />
          </Menu>
        </FlexItem>
      </Flex>
      <Flex
        gap="gap.medium"
        styles={{ width: '315px', height: '78vh', overflowX: 'hidden', overflowY: 'auto' }}
        vAlign='start'
        column={true}
      >
        <List
          items={conversationList}
          truncateHeader={true}
          variables={{
            contentFontSize: `${fontSize}px`
          }}>
          {
            conversationList.map(item => {
              return [
                <ListItem
                  key={item.key} media={<SpeakerPersonIcon size="medium" />}
                  header={item.userId} headerMedia={item.timestamp} content={item.content}
                  endMedia={<EditIcon size='small' onClick={() => handelEdit(item.key, item.content)} />}
                  style={{ marginBottom: '1px' }}

                />,
                <ListItem key={`a${item.key}`} media={<TranslationIcon size="medium" />} content={item.translateContent} />,
                <Divider color="brand" fitted style={{ marginBottom: '2px' }} />,
                <div ref={messagesEndRef}></div>
              ]
            })
          }
        </List>
      </Flex>
      <Flex
        gap="gap.small"
        padding="padding.medium"
        styles={{ width: '315px', backgroundColor: '#33344A' }}
      >
        <FlexItem push>
          <Button icon={<DownloadIcon />} inverted iconOnly primary styles={{ backgroundColor: '#201F1F' }} onClick={handleDownloadEvent} />
        </FlexItem>
        <Tooltip trigger={<Button content="." size="small" iconOnly styles={{ visibility: 'hidden' }} />} content={tooltipContent} open={tooltipOpen} />
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