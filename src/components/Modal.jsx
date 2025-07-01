import "../css/Components.css";

export default function Modal({ text, onClose, onAction }) {
  return (
    <div className="Modal">
      <h2>{text}</h2>
      <div className="modal-buttons">
        <button
          className="btn-modal onClose"
          onClick={onClose}
        >
          Cancel
        </button>
        <button className="btn-modal onAction" onClick={onAction}>
          Yes
        </button>
      </div>
    </div>
  );
}
