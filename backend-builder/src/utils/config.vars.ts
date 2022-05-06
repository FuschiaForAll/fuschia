export const requiredConfigVars: {
  //The key used in the env file
  key: string,
  //A custom error message if you want
  message?: string,
  //A helpful message used for the .env-example file
  note?: string,
  //[Interactive Generator] If the user leaves the field blank, will use this value
  default?: string,
  //Used to only allowed certain options in the env variable ("simple" or "oauth2" for example)
  options?: {
    //The actual value ("simple" in the above example")
    value: string,
    //Other config fields that are required ONLY if this option is chosen. For eg. if "simple", then "EMAIL_USER" config key is a required dependency
    dependencies?: string[]
  }[]
}[] = [
    { key: "SESSION_SECRET", message: "Missing SESSION_SECRET" },
    { key: "MONGO_DB_URL", note: "The `mongodb://` URL used to access the database", default: "mongodb://localhost:27017" },
    { key: "DATABASE_NAME", default: "fuchsia" },
    { key: "REDIS_URL", default: "127.0.0.1" },
    { key: "REDIS_PORT", default: "6379" },
    { key: "HTTP_PORT", default: "4002" },
    { key: "HTTPS_PORT", default: "4003" },
    { key: "S3_ACCESS_KEY" },
    { key: "S3_SECRET" },
    { key: "S3_BUCKET_NAME" },
    { key: "S3_REGION" },
    { key: "FROM_EMAIL_ADDRESS" },
    { key: "APP_ENDPOINT", default: "http://localhost:3000" },
    { key: "DOCKERHUB_USERNAME", note: "This is not the website username, but an access username for their API" },
    { key: "DOCKERHUB_PASSWORD", note: "This is not the website password, but an access token for their API" },
    { key: "GITHUB_API_KEY" },
    {
      key: "EMAIL_TYPE", options: [
        { value: "OAuth2", dependencies: ["EMAIL_USER", "EMAIL_CLIENT_ID", "EMAIL_CLIENT_SECRET", "EMAIL_REFRESH_TOKEN", "EMAIL_EXPIRES"] },
        { value: "Simple", dependencies: ["EMAIL_HOST", "EMAIL_PORT", "EMAIL_USER", "EMAIL_PASS"] }
      ]
    }
  ];
