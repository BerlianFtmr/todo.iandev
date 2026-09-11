# AGENTS Documentation

This document outlines the conventions and rules used by the development agents for this repository.

---

## Commit Message Format
- **Date Prefix**: Every commit message must start with the current date in `YYYY‑MM‑DD` format.
- **Separator**: A space, hyphen, and another space (` - `) separates the date from the rest of the message.
- **Message**: A concise description of the change.

**Example**:
```
2026-09-12 - Add .gitignore for sensitive data
```

---

## Recommended Practices
- **Atomic Commits**: Keep commits focused on a single logical change.
- **Clear Descriptions**: Use imperative mood (e.g., "Add", "Update", "Fix").
- **Reference Issues**: When applicable, include issue numbers (e.g., `#12`).

---

## Automated Agents
The repository utilizes automated agents to:
- Generate documentation (e.g., `README.md`, `AGENTS.md`).
- Ensure `.gitignore` contains sensitive patterns.
- Enforce commit message format.

Agents follow the same commit‑message rule, always prefixing with the date.

---

## Future Enhancements
- Add a pre‑commit hook to automatically prepend the date.
- Integrate a CI check that validates commit messages.

---

*This file is intended for team members and automated agents to maintain consistency across the project.*