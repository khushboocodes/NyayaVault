# Git Workflow & Commit Rules

- **Granular, Atomic Commits**: Always make individual, atomic commits for each logical change, feature, or component one by one.
- **No Large Bulk Commits**: Never bundle unrelated changes or multiple phases into a single giant commit.
- **Mandatory User Approval Before Committing**: Before executing any `git commit`, ALWAYS present a clear, itemized list of all modified, added, and untracked files to the USER and ask for their confirmation on what to commit and what not to commit.
- **Conventional Commit Messages**: Use clear, conventional commit prefixes (e.g., `feat:`, `fix:`, `style:`, `refactor:`, `test:`, `docs:`).
- **Push After Verification**: Commit each step only after user approval and verification, keeping git history transparent, traceable, and modular.
