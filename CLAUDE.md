# Project Overview

This repository contains two projects:

1. **MailCatcher NG** - Ruby gem (`mailcatcher-ng`) that catches emails during development
2. **Website** - Astro v6 website in `website_src/` promoting the project

## Directory Structure

```
mailcatcher/
├── bin/                          # Gem executables
├── lib/                          # Gem source code
├── spec/                         # Gem tests (RSpec)
├── Gemfile, Rakefile, *.gemspec  # Ruby configuration
├── website_src/                  # Astro v6 website
│   ├── src/                      # Pages and components
│   ├── astro.config.mjs
│   └── package.json
└── reference/                    # User documentation
```

## The Ruby Gem

**Tech Stack:** Ruby 3.2-4.0, ERB, SQLite, RSpec

**Setup:**

```bash
bundle install
bundle exec rake spec    # Run tests
bundle exec mailcatcher  # Run locally
```

**Key files:**

- `lib/mail_catcher/version.rb` - Version number
- `lib/mail_catcher/` - Source code
- `spec/` - Tests
- `Rakefile` - Build/test tasks
- `CHANGELOG.md` - Changes

**When modifying the gem:**

1. Make changes in `lib/`
2. Update version in `lib/mail_catcher/version.rb` for releases
3. Update `CHANGELOG.md`
4. Run `bundle exec rake spec` before committing
5. Commit → Push → GitHub Actions publishes to RubyGems

## The Website

**Tech Stack:** Astro v6, Tailwind CSS, Vite, Node.js 24+

**Setup:**

```bash
cd website_src
nvm use                  # Use Node.js 24
npm install
npm run dev              # Hot reload development
npm run build            # Production build
```

**Key files:**

- `website_src/src/pages/` - Page routes
- `website_src/src/components/` - Reusable components
- `website_src/astro.config.mjs` - Configuration
- `website_src/tailwind.config.js` - Tailwind config
- `.nvmrc` - Node.js 24 requirement

**When modifying the website:**

1. cd into `website_src`
2. Ensure `nvm use` shows Node 24+
3. Make changes in `src/`
4. Run `npm run build` before committing
5. Push → GitHub Actions deploys automatically

## Release Process

Releases are **automated via GitHub Actions** when you push to `main`:

```bash
# 1. Update version
vim lib/mail_catcher/version.rb

# 2. Update CHANGELOG
vim CHANGELOG.md

# 3. Commit
git add -A
git commit -m "Release v1.X.X: description"

# 4. Push to main
git push origin main
# OR merge PR to main

# 5. GitHub Actions automatically:
#    - Runs tests
#    - Publishes gem to RubyGems
#    - Deploys website
```

**Do NOT manually run `bundle exec rake release`** - it's handled by the workflow.

## Testing

**Gem tests:**

```bash
bundle exec rake spec           # Run all
bundle exec rake spec --verbose # Verbose output
```

**Website build:**

```bash
cd website_src && npm run build
```

## Common Issues

| Issue | Solution |
| --- | --- |
| Node version wrong in website | Run `nvm use` in `website_src/` |
| Gem tests fail | Run `bundle exec rake spec --verbose` |
| Website won't build | `cd website_src && rm -rf node_modules && npm install && npm run build` |
| Bundler frozen error | Run `bundle install` to update `Gemfile.lock` |

## Git Branches

- `main` - Production, deployed by GitHub Actions
- Feature/fix branches - Create and PR to main
- `upgrade/website` - Current website upgrade branch

## Important Notes

1. **Two tech stacks** - Ruby and JavaScript/Node, context-switch as needed
2. **.nvmrc required** - Website needs Node 24+ configured in `.nvmrc` at root
3. **Gems are auto-published** - GitHub Actions handles release to RubyGems
4. **Version sync** - Keep gem version and CHANGELOG updated together
5. **Claude integration** - Gem includes MCP Server and Claude Plugin support
