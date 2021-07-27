import { useState, useRef, useLayoutEffect, useEffect } from "react";
import tick from "../tick.svg";
import tick_border from "../tick_border.svg";
import { Modal } from "./Modal";
require("./styles/elements.scss");

export const Err_svg = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="158"
      height="158"
      viewBox="0 0 158 158"
    >
      <defs>
        <linearGradient
          id="linear-gradient-red"
          x1="-0.298"
          y1="-0.669"
          x2="1.224"
          y2="1.588"
          gradientUnits="objectBoundingBox"
        >
          <stop offset="0" stopColor="#f93389" />
          <stop offset="1" stopColor="#e3003e" />
        </linearGradient>
      </defs>
      <rect
        id="Rectangle_1104"
        data-name="Rectangle 1104"
        width="158"
        height="158"
        rx="79"
        fill="url(#linear-gradient-red)"
      />
      <g
        id="Component_85_8"
        data-name="Component 85 – 8"
        transform="translate(49.472 49.472)"
      >
        <path
          id="Union_3"
          data-name="Union 3"
          d="M29.527,34.9,5.368,59.057,0,53.686,24.158,29.527,0,5.368,5.368,0l24.16,24.158L53.686,0l5.371,5.368L34.9,29.527l24.16,24.158-5.371,5.371Z"
          fill="#fff"
        />
      </g>
    </svg>
  );
};
export const Succ_svg = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="158"
      height="158"
      viewBox="0 0 158 158"
    >
      <defs>
        <linearGradient
          id="linear-gradient"
          x1="-0.298"
          y1="-0.669"
          x2="1.224"
          y2="1.588"
          gradientUnits="objectBoundingBox"
        >
          <stop offset="0" stopColor="#336cf9" />
          <stop offset="1" stopColor="#1be6d6" />
        </linearGradient>
        <clipPath id="clip-path">
          <rect width="64" height="64" fill="none" />
        </clipPath>
      </defs>
      <g
        id="Group_163"
        data-name="Group 163"
        transform="translate(-0.426 -0.384)"
      >
        <g id="Group_103" data-name="Group 103" transform="translate(0 0)">
          <rect
            id="Rectangle_1104"
            data-name="Rectangle 1104"
            width="158"
            height="158"
            rx="79"
            transform="translate(0.426 0.384)"
            fill="url(#linear-gradient)"
          />
        </g>
        <g
          id="Component_148_2"
          data-name="Component 148 – 2"
          transform="translate(47.426 58.384)"
          clipPath="url(#clip-path)"
        >
          <rect
            id="Rectangle_460"
            data-name="Rectangle 460"
            width="64"
            height="64"
            transform="translate(0 0)"
            fill="none"
          />
          <path
            id="Checkbox"
            d="M25.35,44.087,0,18.737l5.143-5.143L25.35,33.432,58.782,0l5.143,5.143Z"
            transform="translate(0 1.728)"
            fill="#fff"
          />
        </g>
      </g>
    </svg>
  );
};
export const X_svg = () => {
  return (
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
  );
};

export const Step_tick = ({ className }) => {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      width="65"
      height="65"
      viewBox="0 0 65 65"
    >
      <g
        id="Ellipse_110"
        data-name="Ellipse 110"
        fill="#fff"
        stroke="#336cf9"
        strokeWidth="1"
      >
        <circle cx="32.5" cy="32.5" r="32.5" stroke="none" />
        <circle cx="32.5" cy="32.5" r="32" fill="none" />
      </g>
      <path
        id="Checkbox"
        d="M12.267,23.067,0,9.8,2.489,7.112l9.778,10.38L28.444,0l2.489,2.691Z"
        transform="translate(17.034 20.967)"
        fill="#336cf9"
      />
    </svg>
  );
};
export const Step_blank = ({ className }) => {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      width="65"
      height="65"
      viewBox="0 0 65 65"
    >
      <g
        id="Ellipse_229"
        data-name="Ellipse 229"
        fill="#fff"
        stroke="#707070"
        strokeWidth="1"
      >
        <circle cx="32.5" cy="32.5" r="32.5" stroke="none" />
        <circle cx="32.5" cy="32.5" r="32" fill="none" />
      </g>
    </svg>
  );
};
export const Step_fill = ({ className }) => {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      width="65"
      height="65"
      viewBox="0 0 65 65"
    >
      <g
        id="Ellipse_110"
        data-name="Ellipse 110"
        fill="#336cf9"
        stroke="#336cf9"
        strokeWidth="1"
      >
        <circle cx="32.5" cy="32.5" r="32.5" stroke="none" />
        <circle cx="32.5" cy="32.5" r="32" fill="none" />
      </g>
      <path
        id="Checkbox"
        d="M12.267,23.067,0,9.8,2.489,7.112l9.778,10.38L28.444,0l2.489,2.691Z"
        transform="translate(17.034 20.967)"
        fill="#fff"
      />
    </svg>
  );
};

export const Prog_done = () => {
  return (
    <svg
      className="done"
      xmlns="http://www.w3.org/2000/svg"
      width="214.5"
      height="2"
      viewBox="0 0 214.5 2"
    >
      <line
        id="Line_22"
        data-name="Line 22"
        x2="214.5"
        transform="translate(0 1)"
        fill="none"
        stroke="#1be6d6"
        strokeWidth="2"
      />
    </svg>
  );
};
export const Prog_running = () => {
  return (
    <svg
      className="running"
      xmlns="http://www.w3.org/2000/svg"
      width="200"
      height="16.55"
      viewBox="0 0 200 16.55"
    >
      <g
        id="Group_203"
        data-name="Group 203"
        transform="translate(-5063.943 -1197)"
      >
        <path
          id="Path_301"
          data-name="Path 301"
          d="M8.275,10,0,2.3,2.465,0l5.81,5.41L14.085,0,16.55,2.3Z"
          transform="translate(5063.943 1213.55) rotate(-90)"
          fill="#1be6d6"
        />
        <path
          id="Path_302"
          data-name="Path 302"
          d="M8.275,10,0,2.3,2.465,0l5.81,5.41L14.085,0,16.55,2.3Z"
          transform="translate(5073.943 1213.55) rotate(-90)"
          fill="#1be6d6"
        />
        <path
          id="Path_303"
          data-name="Path 303"
          d="M8.275,10,0,2.3,2.465,0l5.81,5.41L14.085,0,16.55,2.3Z"
          transform="translate(5083.943 1213.55) rotate(-90)"
          fill="#1be6d6"
        />
        <path
          id="Path_304"
          data-name="Path 304"
          d="M8.275,10,0,2.3,2.465,0l5.81,5.41L14.085,0,16.55,2.3Z"
          transform="translate(5093.943 1213.55) rotate(-90)"
          fill="#1be6d6"
        />
        <path
          id="Path_305"
          data-name="Path 305"
          d="M8.275,10,0,2.3,2.465,0l5.81,5.41L14.085,0,16.55,2.3Z"
          transform="translate(5103.943 1213.55) rotate(-90)"
          fill="#1be6d6"
        />
        <path
          id="Path_306"
          data-name="Path 306"
          d="M8.275,10,0,2.3,2.465,0l5.81,5.41L14.085,0,16.55,2.3Z"
          transform="translate(5113.943 1213.55) rotate(-90)"
          fill="#1be6d6"
        />
        <path
          id="Path_307"
          data-name="Path 307"
          d="M8.275,10,0,2.3,2.465,0l5.81,5.41L14.085,0,16.55,2.3Z"
          transform="translate(5123.943 1213.55) rotate(-90)"
          fill="#1be6d6"
        />
        <path
          id="Path_308"
          data-name="Path 308"
          d="M8.275,10,0,2.3,2.465,0l5.81,5.41L14.085,0,16.55,2.3Z"
          transform="translate(5133.943 1213.55) rotate(-90)"
          fill="#1be6d6"
        />
        <path
          id="Path_309"
          data-name="Path 309"
          d="M8.275,10,0,2.3,2.465,0l5.81,5.41L14.085,0,16.55,2.3Z"
          transform="translate(5143.943 1213.55) rotate(-90)"
          fill="#1be6d6"
        />
        <path
          id="Path_310"
          data-name="Path 310"
          d="M8.275,10,0,2.3,2.465,0l5.81,5.41L14.085,0,16.55,2.3Z"
          transform="translate(5153.943 1213.55) rotate(-90)"
          fill="#1be6d6"
        />
        <path
          id="Path_311"
          data-name="Path 311"
          d="M8.275,10,0,2.3,2.465,0l5.81,5.41L14.085,0,16.55,2.3Z"
          transform="translate(5163.943 1213.55) rotate(-90)"
          fill="#1be6d6"
        />
        <path
          id="Path_312"
          data-name="Path 312"
          d="M8.275,10,0,2.3,2.465,0l5.81,5.41L14.085,0,16.55,2.3Z"
          transform="translate(5173.943 1213.55) rotate(-90)"
          fill="#1be6d6"
        />
        <path
          id="Path_313"
          data-name="Path 313"
          d="M8.275,10,0,2.3,2.465,0l5.81,5.41L14.085,0,16.55,2.3Z"
          transform="translate(5183.943 1213.55) rotate(-90)"
          fill="#1be6d6"
        />
        <path
          id="Path_314"
          data-name="Path 314"
          d="M8.275,10,0,2.3,2.465,0l5.81,5.41L14.085,0,16.55,2.3Z"
          transform="translate(5193.943 1213.55) rotate(-90)"
          fill="#1be6d6"
        />
        <path
          id="Path_315"
          data-name="Path 315"
          d="M8.275,10,0,2.3,2.465,0l5.81,5.41L14.085,0,16.55,2.3Z"
          transform="translate(5203.943 1213.55) rotate(-90)"
          fill="#1be6d6"
        />
        <path
          id="Path_316"
          data-name="Path 316"
          d="M8.275,10,0,2.3,2.465,0l5.81,5.41L14.085,0,16.55,2.3Z"
          transform="translate(5213.943 1213.55) rotate(-90)"
          fill="#1be6d6"
        />
        <path
          id="Path_317"
          data-name="Path 317"
          d="M8.275,10,0,2.3,2.465,0l5.81,5.41L14.085,0,16.55,2.3Z"
          transform="translate(5223.943 1213.55) rotate(-90)"
          fill="#1be6d6"
        />
        <path
          id="Path_318"
          data-name="Path 318"
          d="M8.275,10,0,2.3,2.465,0l5.81,5.41L14.085,0,16.55,2.3Z"
          transform="translate(5233.943 1213.55) rotate(-90)"
          fill="#1be6d6"
        />
        <path
          id="Path_319"
          data-name="Path 319"
          d="M8.275,10,0,2.3,2.465,0l5.81,5.41L14.085,0,16.55,2.3Z"
          transform="translate(5243.943 1213.55) rotate(-90)"
          fill="#1be6d6"
        />
        <path
          id="Path_320"
          data-name="Path 320"
          d="M8.275,10,0,2.3,2.465,0l5.81,5.41L14.085,0,16.55,2.3Z"
          transform="translate(5253.943 1213.55) rotate(-90)"
          fill="#1be6d6"
        />
      </g>
    </svg>
  );
};
export const Prog_runningBack = () => {
  return (
    <svg
      className="runningBack"
      xmlns="http://www.w3.org/2000/svg"
      width="200"
      height="16.55"
      viewBox="0 0 200 16.55"
    >
      <g
        id="Group_226"
        data-name="Group 226"
        transform="translate(5263.943 1213.55) rotate(-180)"
      >
        <path
          id="Path_301"
          data-name="Path 301"
          d="M8.275,10,0,2.3,2.465,0l5.81,5.41L14.085,0,16.55,2.3Z"
          transform="translate(5063.943 1213.55) rotate(-90)"
          fill="#f6577c"
        />
        <path
          id="Path_302"
          data-name="Path 302"
          d="M8.275,10,0,2.3,2.465,0l5.81,5.41L14.085,0,16.55,2.3Z"
          transform="translate(5073.943 1213.55) rotate(-90)"
          fill="#f6577c"
        />
        <path
          id="Path_303"
          data-name="Path 303"
          d="M8.275,10,0,2.3,2.465,0l5.81,5.41L14.085,0,16.55,2.3Z"
          transform="translate(5083.943 1213.55) rotate(-90)"
          fill="#f6577c"
        />
        <path
          id="Path_304"
          data-name="Path 304"
          d="M8.275,10,0,2.3,2.465,0l5.81,5.41L14.085,0,16.55,2.3Z"
          transform="translate(5093.943 1213.55) rotate(-90)"
          fill="#f6577c"
        />
        <path
          id="Path_305"
          data-name="Path 305"
          d="M8.275,10,0,2.3,2.465,0l5.81,5.41L14.085,0,16.55,2.3Z"
          transform="translate(5103.943 1213.55) rotate(-90)"
          fill="#f6577c"
        />
        <path
          id="Path_306"
          data-name="Path 306"
          d="M8.275,10,0,2.3,2.465,0l5.81,5.41L14.085,0,16.55,2.3Z"
          transform="translate(5113.943 1213.55) rotate(-90)"
          fill="#f6577c"
        />
        <path
          id="Path_307"
          data-name="Path 307"
          d="M8.275,10,0,2.3,2.465,0l5.81,5.41L14.085,0,16.55,2.3Z"
          transform="translate(5123.943 1213.55) rotate(-90)"
          fill="#f6577c"
        />
        <path
          id="Path_308"
          data-name="Path 308"
          d="M8.275,10,0,2.3,2.465,0l5.81,5.41L14.085,0,16.55,2.3Z"
          transform="translate(5133.943 1213.55) rotate(-90)"
          fill="#f6577c"
        />
        <path
          id="Path_309"
          data-name="Path 309"
          d="M8.275,10,0,2.3,2.465,0l5.81,5.41L14.085,0,16.55,2.3Z"
          transform="translate(5143.943 1213.55) rotate(-90)"
          fill="#f6577c"
        />
        <path
          id="Path_310"
          data-name="Path 310"
          d="M8.275,10,0,2.3,2.465,0l5.81,5.41L14.085,0,16.55,2.3Z"
          transform="translate(5153.943 1213.55) rotate(-90)"
          fill="#f6577c"
        />
        <path
          id="Path_311"
          data-name="Path 311"
          d="M8.275,10,0,2.3,2.465,0l5.81,5.41L14.085,0,16.55,2.3Z"
          transform="translate(5163.943 1213.55) rotate(-90)"
          fill="#f6577c"
        />
        <path
          id="Path_312"
          data-name="Path 312"
          d="M8.275,10,0,2.3,2.465,0l5.81,5.41L14.085,0,16.55,2.3Z"
          transform="translate(5173.943 1213.55) rotate(-90)"
          fill="#f6577c"
        />
        <path
          id="Path_313"
          data-name="Path 313"
          d="M8.275,10,0,2.3,2.465,0l5.81,5.41L14.085,0,16.55,2.3Z"
          transform="translate(5183.943 1213.55) rotate(-90)"
          fill="#f6577c"
        />
        <path
          id="Path_314"
          data-name="Path 314"
          d="M8.275,10,0,2.3,2.465,0l5.81,5.41L14.085,0,16.55,2.3Z"
          transform="translate(5193.943 1213.55) rotate(-90)"
          fill="#f6577c"
        />
        <path
          id="Path_315"
          data-name="Path 315"
          d="M8.275,10,0,2.3,2.465,0l5.81,5.41L14.085,0,16.55,2.3Z"
          transform="translate(5203.943 1213.55) rotate(-90)"
          fill="#f6577c"
        />
        <path
          id="Path_316"
          data-name="Path 316"
          d="M8.275,10,0,2.3,2.465,0l5.81,5.41L14.085,0,16.55,2.3Z"
          transform="translate(5213.943 1213.55) rotate(-90)"
          fill="#f6577c"
        />
        <path
          id="Path_317"
          data-name="Path 317"
          d="M8.275,10,0,2.3,2.465,0l5.81,5.41L14.085,0,16.55,2.3Z"
          transform="translate(5223.943 1213.55) rotate(-90)"
          fill="#f6577c"
        />
        <path
          id="Path_318"
          data-name="Path 318"
          d="M8.275,10,0,2.3,2.465,0l5.81,5.41L14.085,0,16.55,2.3Z"
          transform="translate(5233.943 1213.55) rotate(-90)"
          fill="#f6577c"
        />
        <path
          id="Path_319"
          data-name="Path 319"
          d="M8.275,10,0,2.3,2.465,0l5.81,5.41L14.085,0,16.55,2.3Z"
          transform="translate(5243.943 1213.55) rotate(-90)"
          fill="#f6577c"
        />
        <path
          id="Path_320"
          data-name="Path 320"
          d="M8.275,10,0,2.3,2.465,0l5.81,5.41L14.085,0,16.55,2.3Z"
          transform="translate(5253.943 1213.55) rotate(-90)"
          fill="#f6577c"
        />
      </g>
    </svg>
  );
};

export const Plus_svg = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 20 20"
    >
      <line
        id="Line_29"
        data-name="Line 29"
        y2="20"
        transform="translate(10)"
        fill="none"
        stroke="#006dff"
        strokeWidth="2"
      />
      <line
        id="Line_30"
        data-name="Line 30"
        x2="20"
        transform="translate(0 10)"
        fill="none"
        stroke="#006dff"
        strokeWidth="2"
      />
    </svg>
  );
};
export const Minus_svg = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 20 20"
    >
      <line
        id="Line_30"
        data-name="Line 30"
        x2="20"
        transform="translate(0 10)"
        fill="none"
        stroke="#006dff"
        strokeWidth="2"
      />
    </svg>
  );
};
export const Arrow_up_svg = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      viewBox="0 0 18 18"
    >
      <g
        id="Symbol_82"
        data-name="Symbol 82"
        transform="translate(-507 1272) rotate(-90)"
      >
        <path
          id="Path_10"
          data-name="Path 10"
          d="M9,0,7.364,1.636l6.195,6.195H0v2.338H13.558L7.364,16.364,9,18l9-9Z"
          transform="translate(1254 507)"
          fill="#336cf9"
        />
      </g>
    </svg>
  );
};
export const Arrow_down_svg = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      viewBox="0 0 18 18"
    >
      <g id="_1" data-name=" 1" transform="translate(525 -1254) rotate(90)">
        <path
          id="Path_10"
          data-name="Path 10"
          d="M9,0,7.364,1.636l6.195,6.195H0v2.338H13.558L7.364,16.364,9,18l9-9Z"
          transform="translate(1254 507)"
          fill="#ff0080"
        />
      </g>
    </svg>
  );
};
export const Arrow_left_svg = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 16 16"
    >
      <path
        id="Path_10"
        data-name="Path 10"
        d="M8,0,6.545,1.455l5.506,5.506H0V9.039H12.052L6.545,14.545,8,16l8-8Z"
        transform="translate(16 16) rotate(180)"
        fill="#2699fb"
      />
    </svg>
  );
};
export const Chev_down_svg = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="23.616"
      height="13.503"
      viewBox="0 0 23.616 13.503"
    >
      <path
        id="Icon_ionic-ios-arrow-down"
        data-name="Icon ionic-ios-arrow-down"
        d="M18,20.679l8.93-8.937a1.681,1.681,0,0,1,2.384,0,1.7,1.7,0,0,1,0,2.391L19.2,24.258a1.685,1.685,0,0,1-2.327.049L6.68,14.14a1.688,1.688,0,0,1,2.384-2.391Z"
        transform="translate(-6.188 -11.246)"
        fill="#53aefc"
      />
    </svg>
  );
};

export const Checkbox = ({ defaultValue, required, onChange }) => {
  const [checked, setChecked] = useState(defaultValue);
  return (
    <section className="checkbox">
      <div className="ticks" onClick={() => setChecked(!checked)}>
        <input
          type="checkbox"
          value={checked}
          required={required}
          onChange={(e) => {
            setChecked(!checked);
            onChange?.(e);
          }}
        />
        <img src={tick_border} />
        {checked && <img src={tick} />}
      </div>
    </section>
  );
};
export const Combobox = ({
  options,
  defaultValue,
  onChange,
  maxHeight,
  required,
  disabled,
  dataId,
  validationMessage,
  className,
  placeholder,
}) => {
  const [value, setValue] = useState(() => {
    if (defaultValue > -1 && options[defaultValue]) {
      return options[defaultValue].label;
    } else if (typeof defaultValue === "object") {
      return defaultValue;
    } else {
      return "";
    }
  });
  const [open, setOpen] = useState(false);
  const [data, setData] = useState("");
  const [optionsStyle, setOptionsStyle] = useState({});
  const input = useRef();
  const section = useRef();
  const listItemRef = useRef();
  useLayoutEffect(() => {
    const { width, height, x, y } = section.current.getBoundingClientRect();
    setOptionsStyle({
      position: "absolute",
      left: x,
      top: y + height,
      width: width,
      height: listItemRef.current?.clientHeight * options.length || 41,
      maxHeight: window.innerHeight - (y + height) - 16,
    });
  }, [open]);
  return (
    <section
      className={`combobox ${open ? "open" : ""}`}
      ref={section}
      onClick={() => setOpen(!open)}
    >
      {placeholder && !value && <label>{placeholder}</label>}
      <input
        ref={input}
        required={required}
        data={data}
        value={value}
        onFocus={(e) => e.target.blur()}
        onChange={() => {}}
      />
      <button type="button">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="13"
          height="8.872"
          viewBox="0 0 13 8.872"
        >
          <defs>
            <clipPath id="clip-path">
              <rect width="8.872" height="13" fill="none" />
            </clipPath>
          </defs>
          <g
            id="Component_47_7"
            data-name="Component 47 – 7"
            transform="translate(0 8.872) rotate(-90)"
            clipPath="url(#clip-path)"
          >
            <path
              id="Path_36"
              data-name="Path 36"
              d="M6.5,8.872,0,2.036,1.936,0,6.5,4.8,11.064,0,13,2.036Z"
              transform="translate(8.872) rotate(90)"
              fill="#336cf9"
            />
          </g>
        </svg>
      </button>
      <Modal
        className="sectionOptions"
        open={open}
        setOpen={setOpen}
        backdropClass="selectionOptionBack"
        onBackdropClick={() => setOpen(false)}
        style={optionsStyle}
      >
        <ul
          style={{
            width: "100%",
            maxHeight: open ? maxHeight : 0,
            zIndex: 100,
          }}
          className={"options"}
        >
          {options.map((option) => (
            <li
              ref={listItemRef}
              key={option.label}
              onClick={(e) => {
                setData(option.value);
                setValue(option.label);
                onChange && onChange(option);
                setOpen(false);
                input.current.setCustomValidity("");
              }}
              className={`${"option"} ${
                value === option.label ? "selected" : ""
              }`}
            >
              {option.label}
            </li>
          ))}
        </ul>
      </Modal>
    </section>
  );
};
export const NumberInput = ({ defaultValue, min, max, required, onChange }) => {
  const [value, setValue] = useState(defaultValue || 0);
  return (
    <section className="number">
      <input
        type="number"
        step="0.01"
        required={required}
        value={value}
        onChange={(e) => {
          setValue((+e.target.value).toString());
          onChange?.(e);
        }}
        placeholder="0.00"
        min={min}
        max={max}
      />
      <div className="ticker">
        <button type="button" onClick={() => setValue(+value + 1)}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="13"
            height="8.872"
            viewBox="0 0 13 8.872"
          >
            <defs>
              <clipPath id="clip-path">
                <rect width="8.872" height="13" fill="none" />
              </clipPath>
            </defs>
            <g
              id="Component_47_8"
              data-name="Component 47 – 8"
              transform="translate(13) rotate(90)"
              clipPath="url(#clip-path)"
            >
              <path
                id="Path_36"
                data-name="Path 36"
                d="M6.5,8.872,0,2.036,1.936,0,6.5,4.8,11.064,0,13,2.036Z"
                transform="translate(8.872) rotate(90)"
                fill="#336cf9"
              />
            </g>
          </svg>
        </button>
        <button type="button" onClick={() => setValue(+value - 1)}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="13"
            height="8.872"
            viewBox="0 0 13 8.872"
          >
            <defs>
              <clipPath id="clip-path">
                <rect width="8.872" height="13" fill="none" />
              </clipPath>
            </defs>
            <g
              id="Component_47_7"
              data-name="Component 47 – 7"
              transform="translate(0 8.872) rotate(-90)"
              clipPath="url(#clip-path)"
            >
              <path
                id="Path_36"
                data-name="Path 36"
                d="M6.5,8.872,0,2.036,1.936,0,6.5,4.8,11.064,0,13,2.036Z"
                transform="translate(8.872) rotate(90)"
                fill="#336cf9"
              />
            </g>
          </svg>
        </button>
      </div>
    </section>
  );
};

export const Paginaiton = ({
  total,
  btns,
  perPage,
  currentPage,
  setCurrentPage,
  setPage,
}) => {
  const [pages, setPages] = useState([]);
  const [links, setLinks] = useState([]);
  useEffect(() => {
    setPages(
      [...Array(Math.ceil(total / perPage)).keys()].map((num) => num + 1)
    );
    setLinks([...Array(btns).keys()].map((num) => num + 1));
  }, [total, perPage]);
  if (total <= perPage) {
    return <></>;
  }
  return (
    <div className="paginaiton">
      <button
        disabled={currentPage <= 1}
        onClick={() => setPage((prev) => prev - 1)}
      >
        {"<"}
      </button>
      <ul className="pages">
        {pages.length <= btns &&
          pages.map((item) => (
            <li key={item} className={item === currentPage ? "active" : ""}>
              <button onClick={() => setPage(item)}>{item}</button>
            </li>
          ))}
        {pages.length > btns &&
          links.map((item) => {
            const remain = pages.length - btns;
            const middle = Math.ceil(btns / 2);
            let pivit = 0;
            if (currentPage > middle) {
              if (currentPage - middle + btns <= pages.length) {
                pivit = currentPage - middle;
              } else {
                pivit = remain;
              }
            }
            const num = item + pivit;
            return (
              <li key={num} className={num === currentPage ? "active" : ""}>
                <button onClick={() => setPage(item)}>{num}</button>
              </li>
            );
          })}
      </ul>
      <button
        disabled={currentPage >= pages.length}
        onClick={() => setPage((prev) => prev + 1)}
      >
        {">"}
      </button>
    </div>
  );
};
