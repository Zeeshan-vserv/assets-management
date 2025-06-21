import React from "react";
import QRCode from "react-qr-code";



const Test = () => {
  return (
    <div>
      <div style={{ background: "white", padding: "16px" }}>
        <QRCode
          value={
            "Ankit k Raaz Part 3 : Hn mai hu bisexual, mujhe shok h kux anokhi chizon ka agr tumhe v h to please contact 7451995736"
          }
        />
      </div>
    </div>
  );
};

export default Test;
