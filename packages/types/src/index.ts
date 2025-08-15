/**
 * Type definitions for the Weave platform
 *
 * This file defines the core data structures that represent the state of our
 * collaborative storytelling platform. These types form the foundation of
 * both the frontend and backend implementations.
 *
 * Database Storage Strategy:
 * All complex WorldState data is stored as a single JSON object in the database
 * to simplify management of flexible, nested data structures. This approach
 * combines the benefits of relational databases (for core entities) with the
 * flexibility of document databases (for complex game state data).
 */

export * from './channel'
export * from './character'
export * from './message'
export * from './state'
export * from './user'
export * from './world'
