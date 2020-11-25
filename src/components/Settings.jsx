import React from 'react';
import './App.css';
import { Checkbox, Flex, Header, Text, Button } from '@fluentui/react-northstar'
import { useDispatch, useSelector } from 'react-redux'
import { setAutoscroll, setEditable } from './state/settings'
import { useHistory } from "react-router-dom";

function Settings(props) {
    const autoscroll = useSelector(state => state.settings.autoscroll);
    const diseditable = useSelector(state => state.settings.diseditable);
    const dispatch = useDispatch();
    const onAutoScroll = React.useCallback(() => dispatch(setAutoscroll()), [dispatch]);
    const onEditable = React.useCallback(() => dispatch(setEditable()), [dispatch]);
    const history = useHistory();

    const handleBackToMain = () => {
        history.push('/tab')
    }

    return (
        <>
            <div style={{ width: '320px', height: '90vh', overflowX: 'hidden', overflowY: 'auto' }}>
                <Flex gap="gap.small" padding="padding.medium" column>
                    <Flex.Item>
                        <Header as="h3" content="Settings" />
                    </Flex.Item>
                    <Flex.Item>
                        <Text size="small" content='select an option to apply view settings.' />
                    </Flex.Item>
                </Flex>
                <div style={{ padding: '15px' }}>
                    <Checkbox label="Enable Auto-Scroll to bottom." onClick={onAutoScroll} checked={autoscroll} />
                    <Checkbox label="Disable to edit message." onClick={onEditable} checked={diseditable} />
                </div>
                <div style={{ paddingTop: '10px', paddingLeft: '15px' }}>
                    <Button content="Back to main" onClick={handleBackToMain} />
                </div>
            </div>
        </>
    );
}

export default Settings;