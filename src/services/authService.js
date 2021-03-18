export const onFailure = (error) => {
  console.log(error);
};

export const googleResponse = (response) => {
  localStorage.setItem("accessToken", response.accessToken);
  return response.accessToken;
};

export const verifiyToken = () => {
  return new Promise((myResolve, myReject) => {
      const access_token = localStorage.getItem("accessToken");
      if(!access_token) {
        myReject();
        return;
      }
      const tokenBlob = new Blob(
        [JSON.stringify({ access_token }, null, 2)],
        { type: "application/json" }
      );
      const options = {
        method: "POST",
        body: tokenBlob,
        mode: "cors",
        cache: "default",
      };
      fetch("http://localhost:4000/api/v1/auth/google", options)
      .then((response) => {
        if(response.status === 200) {
          const token = response.headers.get("x-auth-token");
          response.json().then((user) => {
            myResolve({ user, token })
          });
        } else {
          localStorage.removeItem("accessToken");
          myReject(error);
        }
      }).catch((error) => {
        localStorage.removeItem("accessToken");
        myReject(error);
      })
  });
}


export const logout = () => {
  localStorage.removeItem("accessToken");
  location.reload();
}