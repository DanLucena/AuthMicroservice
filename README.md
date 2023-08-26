# Auth MicroService

![image](https://github.com/BraveUX/for-the-badge/blob/master/src/images/badges/built-with-grammas-recipe.svg)

This is a simple login microservice to be used for authentication in other future projects, it works in a simple way, with some routes, which will be mentioned below.

To run this project you will need follow the next steps:
1. Install the dependencies running `npm install`.
2. Set up the docker by running `docker-compose up`
3. Run the migrations `npx prisma migrate`
4. Run one instance local of rabbitMQ (I will add this to docker container after).
5. Run the backend (Will be added to docker compose as well) `npx ts-node src/main.ts`.

## Routes

### Create User
This first route is used to create a user, as this repository is a microservice we dont have lots of fields to user model we only need to provide the next fields:

POST /user

body:
```json
{
	"email": "validmail@email.com",
	"password": "validPassword*123",
	"username": "Username"
}
```

response:
```json
{
  "id": "Sample UUID"
}
```

After user create you need to verify your mail to confirm the account creation.

### Resend Confirmation Mail
If the confirmation mail did not arrive you can resend it by requeting this route:

POST /resent-mail-confirmation

```json
{
	"email": "validmail@email.com"
}
```

### Authentication
To authenticate as a user you need to Sign In using your register email and password:

POST /auth

body:
```json
{
  "email": "validmail@email.com",
	"password": "validPassword*123"
}
```

response:
```json
{
  "token": "Sample JWT"
}
```

### Validate
This route is for validations if the token still fresh:

body:
```json
{
  "token": "Sample JWT"
}
```

response:
```json
{
  "email": "validmail@email.com"
}
```

## Next Steps
This project stil on its beggining i need to add some features to it:

- [x] Error code/handling;
- [x] Refresh token;
- [x] Password recover;
- [ ] Error screen;
