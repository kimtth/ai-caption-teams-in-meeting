import { createAction, handleActions } from 'redux-actions'

const AUTOSCROLL = 'settings/AUTOSCROLL';
const EDITABLE = 'settings/EDITABLE';

export const setAutoscroll = createAction(AUTOSCROLL);
export const setEditable = createAction(EDITABLE);

const initialState = {
    autoscroll: true,
    editable: false
}

export const settings = handleActions(
    {
        [AUTOSCROLL]: (state, action) => ({ autoscroll: !state.autoscroll }),
        [EDITABLE]: (state, action) => ({ editable: !state.editable }),
    },
    initialState
)

export default settings;


//1.Action ===> Store <setStore(=Dispatch)> 
//  In class: mapDispatchToProps　→　In Hooks: useDispatch()
//2.Store ===> State <getState>
//  In class: mapStateToProps　→　In Hooks: useSelector()

