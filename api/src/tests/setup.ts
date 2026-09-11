const testEnvironment = {
    PASSWORD_PEPPER: "test-password-pepper",
    SECRET_KEY_JWT: "test-access-token-secret",
    SECRET_REFRESH_KEY_JWT: "test-refresh-token-secret",
    JWT_EXPIRES_IN: "15m",
    JWT_REFRESH_EXPIRES_IN: "7d",
    NODE_ENV: "test",
} as const;

for (const [key, value] of Object.entries(testEnvironment)) {
    process.env[key] = value;
}
