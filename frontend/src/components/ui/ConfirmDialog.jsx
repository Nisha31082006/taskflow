import Modal from './Modal';
import { HiExclamationCircle } from 'react-icons/hi';

const ConfirmDialog = ({ isOpen, onClose, onConfirm, title, message, confirmLabel = 'Delete', danger = true }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm">
      <div className="flex flex-col items-center text-center gap-4">
        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${danger ? 'bg-red-50' : 'bg-amber-50'}`}>
          <HiExclamationCircle className={`w-7 h-7 ${danger ? 'text-red-500' : 'text-amber-500'}`} />
        </div>
        <p className="text-slate-600 text-sm">{message}</p>
        <div className="flex gap-3 w-full">
          <button onClick={onClose} className="btn-secondary flex-1">
            Cancel
          </button>
          <button
            onClick={() => { onConfirm(); onClose(); }}
            className={danger ? 'btn-danger flex-1' : 'btn-primary flex-1'}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmDialog;
