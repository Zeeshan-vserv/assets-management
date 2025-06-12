import React from "react";
import QRCode from "react-qr-code";



const Test = () => {
  return (
    <div>
      <div style={{ background: "white", padding: "16px" }}>
        <QRCode
          value={
            "Ankit Bhai k Raaz : jaane k liye bane rahe humare sath\nheyyy"
          }
        />
      </div>
    </div>
  );
};

export default Test;
