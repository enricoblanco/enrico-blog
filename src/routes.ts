/**
 * An array of routes that are accessible by the public
 * These routes does not require authentication
 * @type {string[]}
 */

export const publicRoutes = ['/', '/about', '/posts']

/**
 * An array of routes that are used for authentication
 * These routes will redirect logged in users to the settings page
 * @type {string[]}
 */
export const authRoutes = ['/auth/login', '/auth/register']

/**
 * The prefix for API authentication routes
 * Routes that start with this prefix are used for API authentication purposes
 * @type {string}
 */
export const apiAuthPrefix = '/api/auth'

/**
 * Default redirect path after logging in
 * @type {string}
 */
export const DEFAULT_LOGIN_REDIRECT = '/settings'
