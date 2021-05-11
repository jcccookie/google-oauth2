import { GOOGLE_APIS, readCookie, CLIENT, REDIRECT_URL, GOOGLE_PEOPLE } from './config.js';

const requestUrl = GOOGLE_APIS;

const data = {
  code: readCookie("code"),
  client_id: CLIENT.CLIENT_ID,
  client_secret: CLIENT.CLIENT_SECRET,
  redirect_uri: `${REDIRECT_URL}/oauth`,
  grant_type: "authorization_code"
}

fetch(requestUrl, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(data)
})
.then(res => res.json())
.then(result => {
  const token = result.access_token;
  const type = result.token_type;
  const authorization = `${type} ${token}`;

  // GET request to google people api

  return fetch(GOOGLE_PEOPLE, {
    method: 'GET',
    headers: { 'Authorization': authorization }
  })
  .then(res => res.json())
  .then(result => {
    const data = {
      first: result.names[0].givenName,
      last: result.names[0].familyName
    }

    document.getElementById("first").innerHTML = `First Name: ${data.first}`;
    document.getElementById("last").innerHTML = `Last Name: ${data.last}`;
    document.getElementById("state").innerHTML = `State: ${readCookie("state")}`;
  })
});