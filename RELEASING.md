# Releasing MailCatcher

Pushing a version tag publishes the gem to RubyGems.org, multi-platform
container images to Docker Hub and GitHub Container Registry, and a GitHub
release containing the gem. Alpha and beta versions become prereleases and do
not update the `latest` container tag.

## One-time publishing setup

Configure these controls before creating the first release tag.

### 1. Protect `main`

1. In **Settings → Rules → Rulesets**, create a branch ruleset named
   `protect-main`.
2. Set **Enforcement status** to **Active** and target the default branch.
3. Enable:
   - restrict deletions
   - require a pull request before merging
   - dismiss stale approvals and require approval of the most recent push when
     there is more than one maintainer
   - require conversation resolution before merging
   - require status checks to pass and require branches to be up to date
   - block force pushes
4. Require one approval when another maintainer is available. A repository with
   only one maintainer must leave this at zero rather than create a rule nobody
   can satisfy.
5. Add the CI checks after they have run at least once:
   - `docker`
   - `test (ubuntu-latest, 3.3)`
   - `test (ubuntu-latest, 3.4)`
   - `test (ubuntu-latest, 4.0)`
   - `test (macos-latest, 3.3)`
   - `test (macos-latest, 3.4)`
   - `test (macos-latest, 4.0)`

Remove required checks that CI no longer emits. In particular, do not require
the old Ruby 3.1 or 3.2 matrix checks.

Do not add a normal bypass. Use an emergency administrator bypass only if the
repository needs a documented break-glass path.

### 2. Restrict release tags

1. In **Settings → Rules → Rulesets**, create a tag ruleset named
   `protect-release-tags`.
2. Set **Enforcement status** to **Active** and target tags matching `v*`.
3. Enable restrictions on tag creation, updates, and deletion, and block force
   pushes.
4. Add only the repository owner or designated release maintainers to the
   bypass list with **Always allow**. Restricting creation means those are the
   only actors who can create a release tag.

Always create release tags from the protected `main` branch. The workflow also
rejects a tag whose commit is not reachable from `origin/main`.

### 3. Create the release environment

1. In **Settings → Environments**, create an environment named `release`.
2. Under **Deployment branches and tags**, choose **Selected branches and
   tags**, add the tag pattern `v*`, and do not add a branch pattern.
3. When another maintainer is available, add that person as a required reviewer
   and enable **Prevent self-review**. Disable administrator bypass if the team
   has a separate reviewer. A solo-maintainer repository must rely on the tag
   ruleset instead of an impossible self-approval rule.
4. Leave the environment secrets empty until the Docker publisher is ready.

The tag rule controls who can start a release; the environment controls when
publishing credentials and RubyGems OIDC are available. Both are required.

### 4. Configure RubyGems trusted publishing

On RubyGems.org, [add a trusted publisher](https://guides.rubygems.org/trusted-publishing/)
to the `mailcatcher` gem with these exact values:

- repository owner: `sj26`
- repository name: `mailcatcher`
- workflow filename: `release.yml`
- environment: `release`

No RubyGems API key is stored in GitHub.

### 5. Configure the Docker Hub publisher

1. Create a dedicated Docker ID used only to publish MailCatcher. Verify its
   email address, enable two-factor authentication, and do not give it access
   to any other Docker Hub repositories.
2. While signed in as `sj26`, open the public `sj26/mailcatcher` repository's
   **Collaborators** tab and add the publisher Docker ID. Docker Hub grants a
   collaborator push and pull access to this repository, but not repository
   administration or deletion access.
3. While signed in as the publisher, [create a personal access token](https://docs.docker.com/security/access-tokens/)
   named `mailcatcher-github-releases` with read and write permissions, but not
   delete permission. Set an expiration date and arrange to rotate it before it
   expires.
4. On the GitHub `release` environment, add:
   - environment variable `DOCKERHUB_USERNAME`: the publisher Docker ID
   - environment secret `DOCKERHUB_TOKEN`: the publisher's token

Do not use a repository secret. Restricting the token to the environment keeps
workflows on ordinary branches from requesting it.

### 6. Configure GitHub Container Registry

No credential is required: the workflow uses its short-lived `GITHUB_TOKEN`.
After the first release creates `ghcr.io/sj26/mailcatcher`, open the package's
settings and make it public.

RubyGems uses OIDC trusted publishing and GitHub Container Registry uses the
workflow's short-lived `GITHUB_TOKEN`. Docker Hub only supports OIDC for
organizations. A personal token is still account-wide for the dedicated
publisher's own account, but within the `sj26` namespace that account has
server-side access only to `sj26/mailcatcher`. A compromised publisher could
create content in its own namespace but could not modify other `sj26`
repositories. The workflow additionally limits Buildx's use of that credential
to pull and push requests for `sj26/mailcatcher`; that client-side scope is
defense in depth, not a substitute for the dedicated account.

## Publish a release

1. Change `MailCatcher::VERSION` in `lib/mail_catcher/version.rb` on a branch,
   open a pull request, and merge it after every required check passes.
2. Update local `main`, verify the version, and tag that commit with the exact
   version prefixed by `v`:

   ```console
   git switch main
   git pull --ff-only origin main
   ruby -Ilib -rmail_catcher/version -e 'puts MailCatcher::VERSION'
   git tag v0.11.0
   git push origin v0.11.0
   ```

3. Approve the `release` environment deployment when GitHub prompts for it.
4. Confirm that the workflow completed and that the same version exists on
   RubyGems.org, Docker Hub, GHCR, and GitHub Releases. For stable releases,
   confirm both container registries also moved `latest` to the new version.

If a registry is temporarily unavailable, rerun the failed workflow. A rerun
reuses the immutable gem already published on RubyGems.org and retries the
remaining container and GitHub release steps.

The release workflow rejects a tag that does not exactly match
`MailCatcher::VERSION`. Ruby prerelease versions retain the existing dot form,
for example `v0.11.0.beta1`.
