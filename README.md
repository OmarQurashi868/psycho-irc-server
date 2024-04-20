# psycho-irc-server
A simple IRC-like chat server backend using websockets with user authentication.

# Usage
- Clone or download the source code
- Open a terminal session in the root folder
- Run `npm install`
- Once it's done, run `npm run start`
## Or just use Docker:
- [Image link](https://hub.docker.com/r/omarqurashi868/psycho-irc-server)

# Config
The port is 3000 by default, this can be changed by any of these:
- Setting a different port to the environment variable `PORT`
- Changing the port variable in index.js
- (Docker only) Forwarding the exposed port 3000 to any other port

The server name can be changed by setting the evnrionment variable `SERVER_NAME`.

> [!TIP]
> If you don't have easy access to environment variables, create a file named `.env` in the root folder and set your variables there:
> ```
> PORT=3000
> SERVER_NAME=My server
> ```
> **You must run the server with `npm run start-env` if using a local `.env file`**

# Endpoints
# /users/
Both endpoints should return a json message containing a `token` key that is used to connect to the Websocket server.
## POST `{server}/users/register`
Registers a new user on the server
### headers
```
{
    authorization: "Basic <base64 encoding of 'username:password'>"
}
```

## GET `{server}/users/login`
Logs in an existing user to the server
### Body
```
{
    username: "username",
    password: "password"
}
```
## Websocket
# /
Connects a user to the Websocket chat server, the `authtoken` header must be provided with a session token from either `/login` or `/register`.
# Received messages format
Messages are received as a JSON string and it's up to the client to parse and format it, the JSON is structured as follows:
```json
{
    "sender":"Sender's username goes here",
    "type":"Is either 'message' for user sent messages or 'alert' for system alerts like connection status",
    "content":"The message content itself, or the alert text"
}
```
