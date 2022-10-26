import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import nookies, { parseCookies, destroyCookie } from "nookies";

export const useAuth = ({ onCompleted, onError, page = "" }) => {
  let dispatch = useDispatch();
  let [user, setUser] = useState(null);
  let [loading, setLoading] = useState(false);
  let [error, setError] = useState(null);

  // check if correct user and fetching that user's data
  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      try {
        let userResponse = await authenticateClient();
        dispatch({ type: "SAVE_USER_STATE", data: userResponse });
        setUser(userResponse);
        // user = userResponse;
      } catch (error) {
        console.log({ error });
        setError(error);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  useEffect(() => {
    if (onCompleted && user) {
      onCompleted(user);
    }
  }, [user]);

  useEffect(() => {
    if (onError && error) {
      onError(error);
    }
  }, [error]);

  return { data: user, loading, error };
};

const authenticateClient = async () => {
  let result = parseCookies();
  let token = result["mj-cookie"];

  // let branch = process.env.branch;

  let uri = null;

  //   if (branch) {
  //     console.log(`Connecting to ${branch} API`);
  //     if (branch === "master") {
  //       uri = `https://app2.getpaid.asia/api`;
  //     } else if (branch === "demo") {
  //       uri = `https://app2.getpaid.technology/api`;
  //     } else if (branch === "integration") {
  //       uri = `https://qa.app2.getpaid.technology/api`;
  //     } else {
  //       uri = `https://getpaid-app2-git-${modifiedBranchName}-getpaid.vercel.app/api`;
  //     }
  //   } else {
  //     console.log("Connecting to localhost API");
  //     uri = "http://localhost:3000/api";
  //   }

  uri = "http://localhost:3002/api/auth";

  let res = null;
  try {
    res = await fetch(uri, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `bearer ${token}`,
      },
    });
  } catch (error) {
    console.log({ error });
    destroyCookie(null, "mj-cookie");
    throw new Error(error);
  }

  let data = await res.json();

  if (data.error) throw new Error(data.error);

  return data.user;
};
