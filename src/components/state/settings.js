import { createAction, handleActions } from 'redux-actions'

const AUTOSCROLL = 'settings/AUTOSCROLL';
const DIS_EDITABLE = 'settings/EDITABLE';

export const setAutoscroll = createAction(AUTOSCROLL);
export const setEditable = createAction(DIS_EDITABLE);

const initialState = {
    autoscroll: true,
    diseditable: false
}

export const settings = handleActions(
    {
        [AUTOSCROLL]: (state, action) => ({ autoscroll: !state.autoscroll, diseditable: state.diseditable }),
        [DIS_EDITABLE]: (state, action) => ({ autoscroll: state.autoscroll, diseditable: !state.diseditable }),
    },
    initialState,
)

export default settings;


//1.Action ===> Store <setStore(==Dispatch)> 
//  In class: mapDispatchToProps　→　In Hooks: useDispatch()
//2.Store ===> State <getState>
//  In class: mapStateToProps　→　In Hooks: useSelector()

