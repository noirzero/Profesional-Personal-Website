# Copilot / AI Agent instructions for this repository

Note: I couldn't find any project files in the workspace when this file was generated. This is a focused, actionable template to help an AI coding agent get immediately productive once repository files are present. Please provide / point to the main source files (e.g. `package.json`, `pyproject.toml`, `README.md`, `src/`) so I can tailor these instructions with concrete examples.

## One-line goal
Make small, well-scoped code changes and PRs that follow the repository's existing build, lint, and testing conventions. Always run the project's build & tests before proposing changes.

## Quick discovery checklist (do this immediately)
1. Detect language/build system
   - Look for: `package.json`, `pyproject.toml`, `requirements.txt`, `setup.py`, `Cargo.toml`, `pom.xml`, `go.mod`, `*.csproj`.
2. Find top-level README and CI workflows
   - Files: `README.md`, `.github/workflows/*.yml` — they often contain build/test commands.
3. Locate source and service boundaries
   - Common folders: `src/`, `app/`, `server/`, `api/`, `functions/`, `packages/`, `components/`.
4. Locate tests and linters
   - Tests: `tests/`, `__tests__/`, `spec/`.
   - Linters/config: `eslint`, `prettier`, `flake8`, `pylint`, `gofmt`, `stylelint`.
5. Inspect dependency manifests for runtime/infra
   - `Dockerfile`, `docker-compose.yml`, `terraform/`, `azure-pipelines.yml`, `serverless.yml`.

## Typical commands (run in PowerShell on Windows; replace with project-specific commands when found)
- Node/npm/yarn (if `package.json` present):

```powershell
# install deps and run tests
npm ci
npm test
# build
npm run build
``` 

- Python (if `pyproject.toml` or `requirements.txt` present):

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
pytest -q
``` 

- Docker (if `Dockerfile` present):

```powershell
docker build -t repo-image .
docker run --rm repo-image
```

Use the exact commands from `README.md` or CI workflows if present — prefer those over generic examples.

## Architecture & conventions to document (what the agent should extract and use)
- Service boundaries: which folders are separate services or packages (e.g., `api/` vs `web/` vs `worker/`).
- Data flow: where models/entities live (e.g., `src/models/`), where persistence is handled (e.g., `db/`, `migrations/`).
- Entry points: files like `server.js`, `app.py`, `main.go`, or `src/index.ts` that start the app.
- Shared code patterns: a `packages/` monorepo structure, shared `utils/` modules, and how imports are resolved (path aliases in tsconfig, PYTHONPATH, etc.).
- Environment variables & secrets: presence of `.env` files or `env.example` and how they are loaded.

When you find these files, add short examples in this file (or notify the agent) such as "server entry: `src/server.ts`" or "DB config: `src/config/db.ts`".

## PR & change guidance (project-specific)
- If repository uses `prettier`/`eslint`/`black`, run the formatter and linter before committing.
- Keep changes minimal and focused to a single intent. Update or add tests near the changed code. Use existing test patterns (unit vs integration).
- If there is a CI workflow, run the same commands locally that CI runs (build, lint, tests) and copy failing output into the PR description if you can't fix it.

## Integration points to check for in the repo
- External APIs or services: look for `axios`, `requests`, `httpx`, `grpc` clients, and check configuration in `config/` or `env` files.
- Cloud infra: `azure`, `aws`, `gcp` clients or IaC files (`terraform/`, `arm`, `bicep`).
- Messaging/queues: `rabbitmq`, `kafka`, `redis` usage and how credentials are provided.

## Merge/Update rules for this file
- If `.github/copilot-instructions.md` already exists, preserve any repository-specific examples and integrate them under the relevant sections above.
- Prefer concrete examples (file paths, commands) over generic statements.

## How to iterate with me (next steps for the repo owner)
1. Commit or point me to the main project files (`package.json`, `pyproject.toml`, `README.md`, `src/`, `.github/workflows/`) so I can extract concrete examples and replace generic commands with the project's real commands.
2. If there are any special developer steps (local database seeds, API keys, required external services), paste them into the README or reply here — I'll incorporate them into this file.

---
If you'd like, I can now:
- Tailor this file to an existing language (Node/Python/.NET) if you upload or point to the relevant files.
- Merge this draft into an existing file (if you provide it) while preserving repository-specific content.

Please tell me which files to inspect next or paste the `package.json` / `README.md` and I'll update this file with concrete examples and 1–2 short sample commands that match your CI.
