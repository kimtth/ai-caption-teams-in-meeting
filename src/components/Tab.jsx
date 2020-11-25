// Copyright (c) TCS Japan Corporation. All rights reserved.

import React from 'react';
import './App.css';
import * as microsoftTeams from "@microsoft/teams-js";
import { List, ListItem, Divider, Tooltip, TextArea, Dialog, Menu, Flex, FlexItem, Button } from '@fluentui/react-northstar'
import { EditIcon, TranslationIcon, DownloadIcon, BulletsIcon, CallRecordingIcon, MicOffIcon, RetryIcon } from '@fluentui/react-icons-northstar'
import * as Config from './api/Constants';
import * as ListStyle from './TabListStyle';
import Conversation from './chat/Conversation';
import { saveTextArea } from './util/Util'
import { TextTranslator, SpeechToTextContinualStart, SpeechToTextContinualStop } from './api/SpeechAPI';
import { writeMessage, listMessages, updateMessage, logInUser, logOutUser } from './chat/InvokeAPI'

import Avatar from 'react-avatar';
import useSocket from 'use-socket.io-client';
import { useBeforeunload } from 'react-beforeunload';
import { useSelector } from 'react-redux'
import { useHistory } from "react-router-dom";

function Tab(props) {
  const autoscroll = useSelector((state) => state.settings.autoscroll);
  const diseditable = useSelector((state) => state.settings.diseditable);
  console.log('autoscoroll', autoscroll, 'diseditable', diseditable)
  const history = useHistory();

  const [context, setContext] = React.useState({});
  const [fontSize, setFontSize] = React.useState(14);
  const [continualRecDisable, setContinualRecDisable] = React.useState(false);
  const [recognizer, setRecognizer] = React.useState();

  /* eslint-disable no-unused-vars */
  const [primarySpeechlanguage, setPrimarySpeechlanguage] = React.useState(Config.SPEECH_INITIAL_PRIMARY_LANGUAGE);
  const [primaryTranslatelanguage, setPrimaryTranslatelanguage] = React.useState(Config.TRANSLATE_INITIAL_PRIMARY_LANGUAGE);
  const [secondarySpeechlanguage, setSecondarySpeechlanguage] = React.useState(Config.SPEECH_INITIAL_SECONDARY_LANGUAGE);
  const [secondaryTranslatelanguage, setSecondaryTranslatelanguage] = React.useState(Config.TRANSLATE_INITIAL_SECONDARY_LANGUAGE);
  /* eslint-disable no-unused-vars */
  const [conversationList, setConversationList] = React.useState([]);
  const [userId, setUserId] = React.useState('');
  const [meetingId, setMeetingId] = React.useState('');

  const [tooltipContent, setTooltipContent] = React.useState('');
  const [tooltipOpen, setTooltipOpen] = React.useState(false);
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [dialogKey, setDialogKey] = React.useState('');
  const [dialogContent, setDialogContent] = React.useState('');
  const [noticeOpen, setNoticeOpen] = React.useState(false);
  const messagesEndRef = React.useRef(null);

  const [tabValue, setTabValue] = React.useState(0);

  React.useEffect(() => {
    // Get the user context from Teams and set it in the state
    microsoftTeams.getContext((teamContext, error) => {
      setContext(teamContext);
      // alert(JSON.stringify(teamContext, null, 4));
      const userId = Object.keys(teamContext).length > 0 ? teamContext['loginHint'] : "";
      const meetingId = (teamContext['meetingId'] == null || teamContext['meetingId'].length === 0) ? teamContext['channelId'] : teamContext['meetingId'];
      setUserId(userId);
      setMeetingId(meetingId);

      //alert(`userID:${userId} meetingId:${meetingId}`);
      logInUser(userId)
        .then(resp => {
          console.log(userId);
          //console.log(JSON.stringify(resp, null, 4))
          if (resp.data.success) {
            initializeConversation(userId, meetingId);
            socketio();
            socketJoin(userId, meetingId);
          } else {
            alert('Incorrect Credentials!');
            setContinualRecDisable(true);
          }
        })
        .catch(err => console.log(JSON.stringify(err, null, 4)))
    });

    microsoftTeams.settings.getSettings((settings) => {
      console.log(JSON.stringify(settings, null, 4))
    })
  }, [])

  useBeforeunload(() => { socketLeave() }) //Kim: session disconnect

  React.useEffect(() => {
    if (autoscroll && messagesEndRef.current)
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
  }, [conversationList])

  const [socket] = useSocket(Config.SocketURL, {
    autoConnect: false, //Kim: very Important!!
    reconnectionAttempts: 5,
    transports: ['websocket']
  });

  const socketio = () => {
    socket.connect();

    socket.on('reconnect_attempt', () => {
      socket.io.opts.transports = ['polling', 'websocket'];
    });

    socket.on('message-client', (conversationItem) => {
      setConversationList(conversationList => [...conversationList, conversationItem])
    })
  }

  const socketJoin = () => {
    socket.emit('join', userId, meetingId);
  }

  const socketLeave = () => {
    socket.emit("remove-event", userId, meetingId)
    socket.disconnect();

    //Kim: call loginout api
    logOutUser()
  }

  const initializeConversation = (userId, channelId) => {
    listMessages({ channelId: channelId, userId: userId })
      .then(resp => {
        const conversations = resp.data;
        if (conversations.length === 0) {
          const conversationItem = new Conversation(`Welcome ${userId}.`, 'Hi There!', 'こんにちは。');
          setConversationList([conversationItem]);
        } else {
          setConversationList(conversations);
        }
      })
      .catch(function (error) {
        console.log('init-conversation', error);
      })
  }

  const handleMode = (mode) => {
    Config.setActiveTab(mode);
    console.log('mode:', mode, 'Active-Tab', Config.ACTIVE_TAB);
    setTabValue(mode)

    if (continualRecDisable) {
      StopRecord();
    }
  }

  const handelMessageEdit = (key, content) => {
    setDialogKey(key);
    setDialogContent(content);
    setDialogOpen(true);
  }

  const onDialogCancel = () => {
    setDialogOpen(false);
    setNoticeOpen(false);
  }

  const onDialogUpdateMessageConfirm = () => {
    const index = indexOfItem(conversationList, dialogKey);
    if (index === -1) {
      console.log('The index of item is not found');
      return;
    }
    const conversationItem = conversationList[index];

    if (conversationItem.metadata) {
      const jsonMeta = JSON.parse(conversationItem.metadata);
      const fromLanguage = jsonMeta.from;
      const toLanguage = jsonMeta.to;

      if (!dialogContent)
        setDialogContent('-');

      TextTranslator(fromLanguage, toLanguage, dialogContent, (translate) => {
        updateMessage({ id: dialogKey, content: dialogContent, translateContent: translate })
          .then(function (response) {
            if (response.status === 200) {
              conversationItem.content = dialogContent;
              conversationItem.translateContent = translate;
              conversationList[index] = conversationItem;

              setConversationList(conversationList);
              setDialogOpen(false);
            } else {
              console.log('There is something wrong');
            }
          })
          .catch(function (error) {
            console.log(error);
          })
      })
    }
  }

  const onChangeTextArea = (e) => {
    setDialogContent(e.target.value);
  }

  const indexOfItem = function (target, value) {
    const index = target.map(function (e) {
      return e.id;
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

  const RecordCallback = (lang, content) => {
    let srcLang = primaryTranslatelanguage;
    let targetLang = secondaryTranslatelanguage;

    if (secondarySpeechlanguage.includes(lang)) {
      srcLang = secondaryTranslatelanguage;
      targetLang = primaryTranslatelanguage;
    }

    TextTranslator(srcLang, targetLang, content, (translate) => {
      const metadata = { from: srcLang, to: targetLang };
      const metadataJson = JSON.stringify(metadata);
      const conversationItem = new Conversation(userId, content, translate, meetingId, metadataJson);
      writeMessage(conversationItem)
        .then(function (response) {
          setConversationList(conversationList => [...conversationList, conversationItem])
          setTooltipOpen(false);
          socket.emit('message', conversationItem, meetingId);
        })
        .catch(function (error) {
          console.log(error);
        })
    })
  }

  const realtimeTooltip = (content) => {
    setTooltipOpen(true);
    setTooltipContent(content);
  }

  const ContinualRecord = () => {
    setContinualRecDisable(true);
    console.log('Active-Tab', Config.ACTIVE_TAB);
    let speechLang = primarySpeechlanguage;
    if (Config.ACTIVE_TAB === 1) {
      speechLang = secondarySpeechlanguage
    }
    console.log('speechLang', speechLang);

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
    setTooltipOpen(false);
  }

  const handleSettings = () => {
    history.push('/setting')
  }

  const handleRetry = () => {
    console.log('reload');
    window.location.reload();
  }

  const userName = (userId) => {
    let userName = "";

    if (userId.includes('@')) {
      userName = userId.split("@")[0];
      userName = userName.replace('.', " ");
    } else {
      return userId;
    }
    userName = 'T K'

    return userName
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
        onConfirm={onDialogUpdateMessageConfirm}
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
        {
          /* 
          activeIndex={tabValue} 
          Kim: Warning: Cannot update a component MenuItem while rendering a different component ContextSelector.Provider
          https://github.com/microsoft/fluentui/issues/13684 
          */
        }
        <Menu defaultActiveIndex={0} activeIndex={tabValue} pointing="end">
          <Menu.Item index={0} key='english' id='en' content='[EN]→[JP]' icon={<TranslationIcon />} onClick={() => handleMode(0)} />
          <Menu.Item index={1} key='japanese' id='ja' content='[JP]→[EN]' onClick={() => handleMode(1)} />
          <Menu.Item key='setting' id='setting' iconOnly icon={<BulletsIcon />} onClick={() => handleSettings()} />
          <Menu.Divider />
          <Menu.Item key='retry' id='retry' iconOnly icon={<RetryIcon />} onClick={() => handleRetry()} />
        </Menu>
      </Flex>
      <Flex
        gap="gap.medium"
        styles={{ width: '315px', height: '78vh', overflowX: 'hidden', overflowY: 'auto' }}
        vAlign='start'
        column={true}
      >
        <List key='msglist' truncateHeader={true}>
          {
            conversationList.map(item => {
              return [
                <ListItem
                  key={item.id} media={<Avatar name={userName(userId)} round={true} size="20" textSizeRatio={1.8} />}
                  header={item.userId}
                  content={{
                    content: item.content,
                    style: ListStyle.styleListSrcItem
                  }}
                  endMedia={diseditable ? "" : <EditIcon size='small' onClick={() => handelMessageEdit(item.id, item.content)} />}
                  style={{
                    marginBottom: '5px',
                  }}
                  variables={{
                    contentFontSize: `${fontSize}px`
                  }}
                />
                ,
                <ListItem key={`a${item.id}`} media={<TranslationIcon size="medium" />}
                  content={
                    {
                      content: item.translateContent,
                      style: ListStyle.styleListTranslateItem
                    }
                  }
                  headerMedia={{
                    content: item.timestamp
                  }}
                  style={{
                    marginBottom: '10px'
                  }}
                  variables={{
                    contentFontSize: `${fontSize}px`
                  }} />,
                // <Divider key={`b${item.id}`} color="brand" fitted style={{ marginBottom: '5px' }} />,
                <div key={`c${item.id}`} ref={messagesEndRef}></div>
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