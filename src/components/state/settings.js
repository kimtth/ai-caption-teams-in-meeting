import { createAction, handleActions } from 'redux-actions'

const AUTOSCROLL = 'settings/AUTOSCROLL';
const DIS_EDITABLE = 'settings/EDITABLE';
const IS_INIT_LOADED = 'settings/ISINITLOADED'

export const setAutoscroll = createAction(AUTOSCROLL);
export const setEditable = createAction(DIS_EDITABLE);
export const setLoaded = createAction(IS_INIT_LOADED, bool => bool);

const initialState = {
    autoscroll: true,
    diseditable: false,
    isinitloaded: false
}

export const settings = handleActions(
    {
        [AUTOSCROLL]: (state) => ({ ...state, autoscroll: !state.autoscroll}),
        [DIS_EDITABLE]: (state) => ({ ...state, diseditable: !state.diseditable }),
        [IS_INIT_LOADED]: (state, { payload: bool } ) => ({ ...state, isinitloaded: bool })
    },
    initialState,
)

export default settings;


//1.Action ===> Store <setStore(==Dispatch)> 
//  In class: mapDispatchToProps　→　In Hooks: useDispatch()
//2.Store ===> State <getState>
//  In class: mapStateToProps　→　In Hooks: useSelector()

