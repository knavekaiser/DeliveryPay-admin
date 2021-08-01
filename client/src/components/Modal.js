import React, { useEffect, forwardRef } from "react";
import ReactDOM from "react-dom";
import { createPortal } from "react-dom";
import { X_svg } from "./Elements";

export const Modal = ({
  containerClass,
  open,
  setOpen,
  children,
  className,
  onBackdropClick,
  backdropClass,
  style,
  head,
  label,
}) => {
  useEffect(() => {
    if (!containerClass) return;
    const portal = document.querySelector("#portal");
    portal.classList.add(containerClass);
    return () => portal.classList.remove(containerClass);
  });
  if (!open) return null;
  return createPortal(
    <>
      <div
        className={`modalBackdrop ${backdropClass}`}
        onClick={() => {
          onBackdropClick?.();
        }}
      />
      <div
        style={{ ...style }}
        className={`modal ${className ? className : ""}`}
      >
        {head && (
          <div className="head">
            <p className="modalName">{label}</p>
            <button onClick={() => setOpen?.(false)}>
              <X_svg />
            </button>
          </div>
        )}
        {children}
      </div>
    </>,
    document.querySelector("#portal")
  );
};

export const Confirm = ({ className, label, question, callback }) => {
  const cleanup = () =>
    ReactDOM.render(<></>, document.querySelector("#confirm"));
  const confirm = () => {
    callback();
    cleanup();
  };
  const decline = () => cleanup();
  ReactDOM.render(
    <>
      <div className={`modalBackdrop`} />
      <div className={`modal confirm ${className || ""}`}>
        <div className="head">
          <p className="modalName">{label}</p>
          <button onClick={decline}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="15.557"
              height="15.557"
              viewBox="0 0 15.557 15.557"
            >
              <defs>
                <clipPath id="clip-path">
                  <rect width="15.557" height="15.557" fill="none" />
                </clipPath>
              </defs>
              <g id="Cancel" clipPath="url(#clip-path)">
                <path
                  id="Union_3"
                  data-name="Union 3"
                  d="M7.778,9.192,1.414,15.557,0,14.142,6.364,7.778,0,1.414,1.414,0,7.778,6.364,14.142,0l1.415,1.414L9.192,7.778l6.364,6.364-1.415,1.415Z"
                  fill="#2699fb"
                />
              </g>
            </svg>
          </button>
        </div>
        <div className="content">
          <p className="question">{question}</p>
          <div className="actions">
            <button className="yes" onClick={confirm}>
              Confirm
            </button>
            <button className="no" onClick={decline}>
              Decline
            </button>
          </div>
        </div>
      </div>
    </>,
    document.querySelector("#confirm")
  );
};

export const Toast = ({ open, children }) => {
  if (!open) return null;
  return createPortal(
    <>
      <div className="toast">{children}</div>
    </>,
    document.querySelector("#portal")
  );
};
