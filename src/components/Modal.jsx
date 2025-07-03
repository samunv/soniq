import "../css/Components.css";

export default function Modal({ text, onClose, onAction, onActionText, children }) {
  return (
    <div className="Modal">
      <h2>{text}</h2>
      {children ? children : ""}
      <div className="modal-buttons">
        <button className="btn-modal onClose" onClick={onClose}>
          Cancel
        </button>
        <button className="btn-modal onAction" onClick={onAction}>
          {onActionText}
        </button>
      </div>
    </div>
  );
}
