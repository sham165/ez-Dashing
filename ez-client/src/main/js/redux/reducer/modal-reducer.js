import Logger from 'utils/logger';
import {ModalEvent} from 'redux/event/modal-event';
import {WidgetEvent} from 'redux/event/widget-event';

const logger = Logger.getLogger("ModalReducer");

const initialState = {
  onError: false,
  visible: false,
  modalComponent: null
};

export default function ModalReducer(state = initialState, action) {
  switch (action.type) {

    case ModalEvent.ShowModal:
      logger.debug("Show modal");
      return {
        ...state,
        onError: false,
        visible: true,
        modalComponent: action.payload
      };

    case WidgetEvent.UpdateConfigSuccess:
    case ModalEvent.HideModal:
      logger.debug("Hide modal");
      return {
        ...state,
        onError: false,
        visible: false
      };

    case WidgetEvent.UpdateConfigFailed:
      logger.debug("Show error on modal ({})", action.payload);
      return {
        ...state,
        onError: true,
        errorMessage: action.payload
      };

    default:
      return state
  }
}
