# Git Workflow & Commit Rules

- **Granular, Atomic Commits**: Always make individual, atomic commits for each logical change, feature, or component one by one.
- **No Large Bulk Commits**: Never bundle unrelated changes or multiple phases into a single giant commit.
- **Mandatory User Approval Before Committing**: Before executing any `git commit`, ALWAYS present a clear, itemized list of all modified, added, and untracked files to the USER and ask for their confirmation on what to commit and what not to commit.
- **Conventional Commit Messages**: Use clear, conventional commit prefixes (e.g., `feat:`, `fix:`, `style:`, `refactor:`, `test:`, `docs:`).
- **Zero Secret / API Key Leakage Policy (MANDATORY)**: 
  - Before staging (`git add`) or committing (`git commit`), ALWAYS conduct a thorough security scan across all modified lines (`git diff`) and untracked files.
  - Strictly verify that NO API keys, authentication tokens (e.g. `TURSO_AUTH_TOKEN`, `SUPABASE_SERVICE_ROLE_KEY`), JWT secrets, private keys, database passwords, environment files (`.env`, `.env.local`), or sensitive personal data are revealed or committed.
  - All credentials must strictly reside in `.env` (which MUST be ignored in `.gitignore`) and accessed exclusively via `process.env`.
  - If any credential, token, or private key is found, IMMEDIATELY abort the commit and alert the user.
- **Push After Verification**: Commit each step only after user approval and verification, keeping git history transparent, traceable, and modular.
