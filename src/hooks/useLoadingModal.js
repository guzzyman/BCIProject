import { toggleLoadingModalAction } from "common/StoreSlice";
import { useDispatch, useSelector } from "react-redux";

export function useLoadingModal() {
  const dispatch = useDispatch();

  const isLoadingModal = useSelector((state) => state.global.isLoadingModal);
  
  function toggleLoadingModal(payload) {
    return dispatch(toggleLoadingModalAction(payload));
  }

  return { isLoadingModal, toggleLoadingModal };
}

export default useLoadingModal;
