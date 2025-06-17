import React from "react";
import QRCode from "react-qr-code";



const Test = () => {
  return (
    <div>
      <div style={{ background: "white", padding: "16px" }}>
        <QRCode
          value={
            "hello"
          }
        />
      </div>
    </div>
  );
};

export default Test;
