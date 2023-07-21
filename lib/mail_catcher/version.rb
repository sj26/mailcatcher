# frozen_string_literal: true

module MailCatcher
  # When updating version, keep in mind Semantic Versioning http://semver.org/
  # TL;DR; (Major.Minor.Patch)
  # Releases before 1.0.0 are in active development and can change anytime
  # 1.0.0 and up is indication and declaration of a stable public API
  # Major - Incremented for incompatible changes with previous release (or big enough new features)
  # Minor - Incremented for new backwards-compatible features + deprecations
  # Patch - Incremented for backwards-compatible bug fixes
  VERSION = File.read(".version").strip
end
