import React, { useEffect, useState } from "react";
import { useLoaderData } from "react-router";

const Github = () => {
  const data = useLoaderData();
  // const [data, setData] = useState(null);

  // useEffect(() => {
  //   fetch("https://api.github.com/users/neevan0842")
  //     .then((res) => res.json())
  //     .then((res) => setData(res));
  // }, []);

  return (
    <div className="text-center m-4 bg-gray-600 text-white p-4 text-3xl">
      Github Profile : {data && data.name}
      <img src={data && data.avatar_url} alt="avatar" />
    </div>
  );
};

export default Github;

export const githubInfoLoader = async () => {
  const res = await fetch("https://api.github.com/users/neevan0842");
  return res.json();
};
