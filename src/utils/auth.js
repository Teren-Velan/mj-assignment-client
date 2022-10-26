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

  let nodeEnv = process.env.NODE_ENV;

  let uri = null;

  if (nodeEnv) {
    console.log(`Connecting to ${nodeEnv} API`);
    if (nodeEnv === "production") {
      uri = `https://mighty-assignment-api.herokuapp.com/api/auth`;
    }
  } else {
    console.log("Connecting to localhost API");
    uri = "http://localhost:3002/api/auth";
  }

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
