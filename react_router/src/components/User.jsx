import React from "react";
import { useParams } from "react-router";

const User = () => {
  const { userId } = useParams();

  return (
    <div className="flex flex-col items-center">
      <h3 className="text-2xl font-bold">
        {userId ? `UserId: ${userId}` : "Provide UserId as url parameter"}
      </h3>
    </div>
  );
};

export default User;
