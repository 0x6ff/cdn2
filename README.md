# arnaCDN Server
Currently under development... It's public but you shouldn't really use this, it's pretty bad, I'm just learning Node with this project.

## SQL Setup
**USERS(user_id, user_name, user_nick, user_pw_hash)**

user_id = INT(7) PK AUTO_INCREMENT NOT_NULL

user_name = VARCHAR(20) UNIQUE NOT_NULL

user_nick = VARCHAR(20) NOT_NULL

user_pw_hash = VARCHAR(128) NOT_NULL

## API Reference
**/files (disabled):**
  - Query:
```
KEY: user_name
VALUE: username string 

KEY: user_pw
VALUE: user password string (unhashed)

EXAMPLE: http://localhost:8080/files?user_name=arna13&user_pw=mySecretPass
```
wip...

## Setup

Install npm dependencies
```npm install```

Setup the env variables for your system
```
cp .env.example .env
nano .env
chmod 600 .env
```

Run with node or npm
```
node .src/server.js
```
```
npm run dev
```
