export default function authHeader() {
    const accessToken = JSON.parse(localStorage.getItem("accessToken"));
  
    if (accessToken) {
      return { token: 'Bearer ' + accessToken };
    } else {
      return {};
    }
  }
  