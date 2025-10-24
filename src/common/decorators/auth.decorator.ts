/* eslint-disable prettier/prettier */
import { SetMetadata } from '@nestjs/common';

/**
 * Auth Decorators
 * 
 * Provides utilities to define and access metadata related to route-level permissions.
 * These decorators are used in combination with PermissionGuard to enforce fine-grained
 * authorization based on user privileges.
 * 
 * Exports:
 * - PRIVILEGES_KEY: The metadata key used to store required privileges on route handlers.
 * - @Privileges(...privileges: string[]): Decorator to assign required privileges to a controller or route handler.
 * 
 * Responsibilities:
 * - Allow declarative assignment of required privileges to routes.
 * - Enable PermissionGuard to retrieve metadata and enforce access control.
 * 
 * Usage:
 * Apply @Privileges('READ', 'POST') on a route or controller to specify which privileges are required.
 */
export const PRIVILEGES_KEY = 'privileges';
export const Privileges = (...privileges: string[]) =>
  SetMetadata(PRIVILEGES_KEY, privileges);
