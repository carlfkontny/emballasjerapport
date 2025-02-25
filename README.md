# Plastpartnerskapet

## Database

This project uses Prisma as the ORM with SQL Server as the database. Below are the essential commands and workflows for working with the database.

### Setup

1. Make sure you have the required environment variables in your `.env` file:

   ```
   DATABASE_URL="sqlserver://..."
   SHADOW_DATABASE_URL="sqlserver://..."
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Generate Prisma Client:
   ```bash
   npx prisma generate
   ```

### Common Commands

- **View Database Studio**: Launch Prisma Studio to view and edit data

  ```bash
  npx prisma studio
  ```

- **Update Database Schema**: After making changes to `schema.prisma`

  ```bash
  npx prisma db push    # Quick updates during development
  # or
  npx prisma migrate dev # For production-ready migrations
  ```

- **Reset Database**: Clear all data and apply migrations
  ```bash
  npx prisma migrate reset
  ```

### Development Workflow

1. Make changes to `prisma/schema.prisma`
2. Run `npx prisma generate` to update the Prisma Client
3. Run `npx prisma db push` to update your database

## Git Hooks

This project uses Git hooks to ensure code quality. The hooks are automatically installed when you run `npm install` (via the `prepare` script).

### Pre-push Hook

The pre-push hook runs the following checks before allowing code to be pushed:

- TypeScript type checking (`npm run typecheck`)
- ESLint static analysis (`npm run lint`)

If any of these checks fail, the push will be blocked. You can bypass the hooks in emergency situations using `git push --no-verify` (not recommended).
