# Kevin and Austin's Wedding

Because I'm a total geek, this is our custom wedding site. Why? Well, have you seen what other templated wedding sites look like?

# Requirements

* .NET 6.x SDK
* NPM/Node 18+
* Azure account to support Azure AD - if installing from the repo without using any established infrastructure, you will need to set up the application in Azure AD. Refer to Microsoft documentation to establish the tenant and client ID required below.

# Initial setup

* Run dotnet restore in the /API folder to get the Nuget packages
* Run npm i in the /clientapp folder to get the Angular/Node packages
* Set up the following user secrets in the root folder:

| User secret | Description |
|--|--|
| ConnectionStrings:Wedding | Postgres database connection |
| AppSettings:Secret | JWT secret for authentication |
| AppSettings:Salt | JWT salt |
| AppSettings:Password | City that we are getting married in, aka the 'password' |
| AppSettings:Issuer | JWT issuer, aka the Angular site URL |
| AppSettings:Audience | JWT Audience, aka the root URL |
| AppSettings:AdminPassword | Admin password. Used for all users who have adminFlag set to true in the DB. |

* Update ClientApp/environment/environment.ts with the required URL changes
* Run the initial database migration

## Database creation

Standard EF migration processes are followed. To create the database locally from a blank server, run `dotnet ef database update 0` for the initial creation. Then run `dotnet ef database update` to get the most current version. 

The dotnet CLI tools must be installed for this, and a dotnet restore must be done to ensure all packages are downloaded before migration.

## Trusting dev-certs

If you need to trust the development certificates in .NET core, run the following commands:
```
dotnet dev-certs https --clean
dotnet dev-certs https --trust
```

# Running the App

The API and UI are run together via the dotnet angular template. Just run the API and this will also run the UI.

Swagger can be found at the API endpoint `/swagger`. This only runs in the dev hosting environment.

# Automated tests

Automated testing needs to be written.

# Dependencies

This site utilizes code from the following repos:
- Platinum - https://github.com/robbiebyrd/platinum
- Oscar The Grouch v1 - https://github.com/charlierobin/oscar-the-grouch-version-1
- Carthage Font - https://github.com/csyde/carthage-fonts