import React from 'react';

export default function(props) {
    return (
      <button className={props.CSSclass} onClick={() => props.onClick()}>
        {props.label}
      </button>
  )
}
