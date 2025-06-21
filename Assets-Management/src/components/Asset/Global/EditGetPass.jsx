import React from "react";
import { useParams } from "react-router-dom";

function EditGetPass() {
  const { id } = useParams();
  console.log("id", id);
  return (
    <>
      <div>EditGetPass: {id}</div>
    </>
  );
}

export default EditGetPass;
