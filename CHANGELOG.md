# Changelog

All notable changes to MailCatcher NG will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.6.4] - 2026-07-01

### Changed

- Upgraded GitHub Actions to use actions/checkout@v7.0.0 and Node.js 24

## [1.6.3] - 2026-07-01

### Changed

- Upgraded GitHub Actions to Node.js 24 compatible versions

## [1.6.2] - 2026-07-01

### Changed

- Bug fixes and updates

## [1.6.1] - 2026-07-01

### Changed

- Updated gem dependencies for security and compatibility
- Updated jQuery to version 4.0.0 on website

### Dependencies

- **Gems**: concurrent-ruby, json, mail, net-imap, nokogiri, sqlite3, websocket-driver, psych, rubyzip, selenium-webdriver

## [1.5.7] - 2026-05-17

### Changed

- Added a dedicated proxy for remote email resources in the HTML preview
- Kept internal message URLs strict while preserving external image and document rendering
- Added regression coverage for remote resource rewriting

## [1.5.6] - 2026-05-17

### Changed

- Added explicit handling for unknown or unsupported message content types
- Surfaced a concise content-type error state in the message viewer
- Hardened the release workflow permissions
- Fixed CodeQL findings in the message viewer JavaScript

## [1.5.4] - 2026-05-06

### Changed

- Updated gem dependencies for security and compatibility
- Updated JavaScript dependencies for website

### Dependencies

- **Gems**:
  - mcp 0.14.0 → 0.15.0
  - sqlite3 2.9.3 → 2.9.4

- **JavaScript**:
  - jquery 3.7.1 → 4.0.0

## [1.5.3] - 2026-03-16

### Changed

- Gem updates: Updated 21 dependencies to latest versions for security and compatibility
- Removed Dockerfile and docker rake task (Docker builds managed separately)

### Dependencies

- **Updated**:
  - addressable 2.8.8 → 2.8.9
  - capybara-screenshot 1.0.26 → 1.0.27
  - erb 6.0.1 → 6.0.2
  - json 2.18.0 → 2.19.1
  - net-imap 0.6.2 → 0.6.3
  - nokogiri 1.19.0 → 1.19.1
  - parser 3.3.10.1 → 3.3.10.2
  - prism 1.8.0 → 1.9.0
  - public_suffix 7.0.2 → 7.0.5
  - rack 3.2.4 → 3.2.5
  - rdoc 7.1.0 → 7.2.0
  - rspec-mocks 3.13.7 → 3.13.8
  - rspec-support 3.13.6 → 3.13.7
  - rubocop 1.82.1 → 1.85.1
  - selenium-webdriver 4.40.0 → 4.41.0
  - sqlite3 2.9.0 → 2.9.2
  - timeout 0.6.0 → 0.6.1

- **New**:
  - json-schema 6.2.0 (for MCP validation)
  - mcp 0.8.0 (Model Context Protocol server support)
  - bigdecimal 4.0.1 (stdlib dependency)

## [1.5.2] - 2026-01-12

### Added

- **Claude Integration**: Complete integration with Claude through two complementary methods
  - **Claude Plugin**: HTTP-based plugin for Claude.com and Claude Desktop
    - Zero configuration required - just start with `--plugin` flag
    - Automatic plugin discovery via `.well-known/ai-plugin.json`
    - Dynamic OpenAPI spec generation for plugin compatibility
    - Natural language interface to all email tools
  - **MCP Server**: Model Context Protocol server for programmatic access
    - Full MCP 2024-11-05 protocol implementation
    - JSON-RPC 2.0 over stdio for reliability
    - Optional feature - enable with `--mcp` flag only when needed
    - Thread-safe operation within EventMachine reactor

- **Claude Integration Tools** (7 powerful tools exposed via Plugin and MCP):
  - `search_messages`: Full-text search with filtering (query, limit, attachments, date range)
  - `get_latest_message_for`: Find latest message for recipient with optional subject filtering
  - `extract_token_or_link`: Extract OTPs, magic links, reset tokens from messages
  - `get_parsed_auth_info`: Get structured authentication information
  - `get_message_preview_html`: Get responsive HTML preview with mobile optimization
  - `delete_message`: Delete specific message by ID
  - `clear_messages`: Delete all caught messages

- **Plugin HTTP Endpoints**:
  - `GET /.well-known/ai-plugin.json`: Standard AI plugin manifest
  - `GET /plugin/openapi.json`: Dynamic OpenAPI specification
  - `POST /plugin/search`: Message search
  - `GET /plugin/message/:id/latest`: Get latest for recipient
  - `GET /plugin/message/:id/tokens`: Extract tokens
  - `GET /plugin/message/:id/auth-info`: Get auth information
  - `GET /plugin/message/:id/preview`: Get HTML preview
  - `DELETE /plugin/messages`: Clear all
  - `DELETE /plugin/message/:id`: Delete single

### Changed

- **Command-line Options**: Added Claude integration flags
  - `--mcp`: Enable MCP server for Claude integration
  - `--plugin`: Enable Claude Plugin endpoints
  - Both can be used together or separately

- **Integration Architecture**: New optional integration layer
  - Single source of truth for tools (MCPTools module)
  - Protocol-independent tool implementation
  - Shared business logic for both MCP and Plugin
  - Zero breaking changes to existing functionality

### Documentation

- New comprehensive Claude Integration guide ([CLAUDE_INTEGRATION.md](CLAUDE_INTEGRATION.md))
- MCP Server setup documentation ([docs/MCP_SETUP.md](docs/MCP_SETUP.md))
- Claude Plugin setup documentation ([docs/CLAUDE_PLUGIN_SETUP.md](docs/CLAUDE_PLUGIN_SETUP.md))
- Integration architecture documentation ([docs/INTEGRATION_ARCHITECTURE.md](docs/INTEGRATION_ARCHITECTURE.md))
- Updated FEATURES.md with Claude integration and accessibility features
- Updated README with Claude integration section
- Updated reference/USAGE.md with MCP and Plugin options

### Technical Details

- **MCP Implementation**:
  - Complete JSON-RPC 2.0 protocol handler
  - Stdio-based transport for Claude integration
  - Error handling and validation
  - Tool registry pattern for extensibility

- **Plugin Implementation**:
  - Sinatra HTTP routes for plugin endpoints
  - Dynamic OpenAPI spec generation
  - Helper methods for response formatting
  - No authentication required (local-only by default)

- **Integration Management**:
  - Orchestrator module for lifecycle management
  - Thread-safe startup and shutdown
  - Logging to stderr for debugging
  - Optional features with zero overhead if unused

## [1.5.0] - 2026-01-12

### Added

- **Message Search & Filtering API**: Comprehensive search endpoint for finding messages
  - New `/messages/search` endpoint with query string support
  - Filter by search terms across subject, sender, recipients, and body content
  - Date range filtering with `from` and `to` parameters
  - Attachment filtering with `has_attachments` parameter
  - Fast indexed queries using SQLite

- **Token & Code Extraction**: Automated extraction of common authentication elements
  - New `/messages/:id/extract` endpoint with token type support
  - Extract magic verification links from messages
  - Extract 6-digit OTP codes and one-time passwords
  - Extract reset tokens and authentication URLs
  - Intelligent pattern matching with context preservation

- **Links & Content Analysis**: Comprehensive link extraction from messages
  - New `/messages/:id/links.json` endpoint for extracting all links
  - Metadata about link purpose (verification, unsubscribe, etc.)
  - Support for extracting links from both HTML and plain text parts
  - Link text and href preservation with semantic classification

- **Message Structure Parsing**: Unified structured data extraction
  - New `/messages/:id/parsed.json` endpoint for complete message analysis
  - Returns verification URLs, OTP codes, reset tokens, unsubscribe links
  - Complete link list with categorization
  - Centralized access to commonly needed message elements

- **Email Accessibility Scoring**: Comprehensive accessibility analysis for emails
  - New `/messages/:id/accessibility.json` endpoint for accessibility evaluation
  - Score calculation (0-100) across multiple dimensions
  - Detailed breakdown of specific accessibility issues
  - Automated recommendations for improving email accessibility
  - Checks for alt text on images, semantic HTML, link text quality

- **Message Forwarding**: SMTP-based message forwarding capability
  - New `POST /messages/:id/forward` endpoint for forwarding messages
  - Forwarding configuration via command-line options:
    - `--forward-smtp-host`: SMTP server hostname
    - `--forward-smtp-port`: SMTP server port
    - `--forward-smtp-user`: SMTP username
    - `--forward-smtp-password`: SMTP password
    - `--[no-]forward-smtp-tls`: Enable/disable TLS (default: enabled)
  - Forward caught emails to original recipients or other SMTP servers
  - Useful for final validation before production deployment

- **Example Email Files**: New example email templates for testing
  - `accessible_email`: Well-structured email demonstrating accessibility best practices
  - `verification_email`: Email with OTP code and verification link for testing extraction
  - `password_reset`: Email template with password reset token for testing
  - `newsletter_with_links`: Newsletter template with multiple link types
  - `poor_accessibility_email`: Email with accessibility issues for testing accessibility scoring

- **API Documentation**: Comprehensive API reference updates
  - Documented all new advanced endpoints
  - Added usage examples for search, extraction, and forwarding features
  - Complete parameter documentation with response formats
  - Real-world usage examples for automated testing and integration

### Changed

- **Command-line Options**: Added SMTP forwarding configuration flags
  - New options for configuring forwarding SMTP server
  - Support for TLS/non-TLS forwarding connections

- **API Structure**: Enhanced message endpoint organization
  - Clear separation between basic and advanced endpoints
  - Consistent JSON response formatting across new endpoints

### Technical Details

- **Database**: Enhanced message search with efficient SQL queries
  - Added `search_messages` method with dynamic query building
  - Optimized JOIN operations for body content searches
  - Proper parameter binding for SQL injection prevention

- **Mail Module Extensions**: New methods for content analysis
  - `extract_tokens`: Extract authentication tokens from message content
  - `extract_all_links`: Extract and categorize links from HTML and plain text
  - `parse_message_structured`: Unified structured data parsing
  - `accessibility_score`: Comprehensive accessibility evaluation
  - `forward_message`: Send message via external SMTP server
  - Helper methods for pattern detection (OTP, magic links, reset tokens)

- **HTML/Content Processing**: Nokogiri integration for HTML analysis
  - Added Nokogiri gem dependency for HTML parsing
  - Support for DOM analysis and accessibility checking
  - Semantic HTML detection and validation

## [1.4.6] - 2026-01-12

### Added

- **Version Update Notification**: Added notification badge in header to alert users of new available versions
  - Checks GitHub API for latest release
  - Displays update availability with direct link to download page
  - Shows "latest version" indicator when up-to-date

### Fixed

- **Server Info Page Tooltip**: Made session ID tooltip sticky
  - Changed `hideOnClick` from 'toggle' to false to prevent closing when interacting with tooltip
  - Added custom outside-click handler to properly close tooltip when clicking outside
  - Tooltip now stays open while copying session ID to clipboard

- **WebSocket Initialization**: Fixed initialization timing issues after page reload in quit test
  - Proper wait handling for WebSocket connection establishment
  - Fixed quit button and event handler conflicts

- **DOM Ready Event**: Fixed MailCatcher initialization to use native DOMContentLoaded event
  - Improved startup reliability and consistency

- **Test Framework**: Improved wait helper to accept optional timeout parameter
  - Increased WebSocket wait timeout in quit test for better reliability

- **Build Compatibility**: Fixed Uglifier compatibility with ES6 class field syntax

### Changed

- **Development Tools**: Bumped Node.js version to 22 in GitHub Actions workflows
- **Package Management**: Added package-lock.json for npm dependency locking
- **npm Configuration**: Improved npm configuration in GitHub Actions workflows

## [1.4.4] - 2026-01-12

### Changed

- **npm Dependency Management**: Removed CoffeeScript and modernized JavaScript build system
  - Converted `mailcatcher.js.coffee` to modern ES6 JavaScript
  - Added `package.json` with explicit npm dependency tracking
  - Dependencies: jQuery 3.7.1, @popperjs/core 2.11.8, tippy.js 6.3.7, highlight.js 11.9.0
  - Removed jQuery 1.x vendored file and coffee-script gem dependency

- **Asset Pipeline Improvements**:
  - Implemented automatic npm symlink creation for development environment
  - Updated `lib/mail_catcher/web/assets.rb` with npm asset handling
  - Source maps now included in development for better debugging (jquery.min.map, popper.min.js.map)
  - Production builds copy npm dependencies to public/assets/
  - Cleaned up duplicate highlight.js files

- **Server Info Page Enhancements**: Fixed tooltip flickering and improved UX
  - Changed tooltips from hover-based to click-based triggers for better usability
  - Prevents tooltip destruction/recreation during auto-refresh (eliminates flicker)
  - Added `hideOnClick: 'toggle'` so tooltips close when clicking outside
  - Improved event handling with proper event propagation control
  - Bundled Popper.js and Tippy.js from npm instead of CDN for better reliability

- **GitHub Actions Workflows**: Enhanced CI/CD for npm-based builds
  - Added Node.js 20 setup with npm caching to both ci.yml and release.yml
  - Added explicit `npm install` step before asset compilation
  - Enhanced asset verification with 12 required assets including source maps
  - Comprehensive gem verification ensuring all assets are bundled correctly

### Fixed

- Tooltip flickering on server info page during auto-refresh
- Incorrect asset reference (highlight-lib.min.js → highlight.min.js)
- npm dependencies not loading in development mode
- Rack compatibility issue with private method visibility in AssetsApp

## [1.4.0] - 2026-01-12

### Added

- **SMTP Transcript Enhancements**: Improved transcript capture and storage
  - Connection closure entries now properly included in transcripts
  - Full conversation history from connection establishment to closure
  - Persistent database option with `--persistence` flag for storing messages in SQLite

- **Test Improvements**: Comprehensive test fixes and enhancements
  - Fixed JSON endpoint tests with proper response parsing
  - Added helper methods for Capybara/Selenium compatibility
  - Fixed HTML text matching with CSS text-transform considerations
  - Improved 404 error handling in tests

### Changed

- **Transcript Saving Logic**: Deferred transcript saving until connection close
  - Transcripts now save when connection closes (in `unbind` method)
  - Ensures "Connection closed" entry is captured in final transcript
  - Maintains message_id linkage when available

- **Database**: Changed from in-memory SQLite to optional persistent storage
  - New `determine_db_path` method for flexible storage configuration
  - In-memory by default, persistent when `--persistence` flag is used

### Fixed

- Connection closure not being recorded in SMTP transcripts
- Transcript entries not being preserved after message delivery
- JSON response parsing in Selenium/Capybara tests
- HTML text matching failures due to CSS text transformation

## [1.3.3] - 2026-01-12

### Added

- **Comprehensive Test Coverage**: Enhanced test suite for SMTP transcript and message handling
  - Full coverage for transcript creation and storage
  - Tests for message deletion and cleanup functionality
  - Edge case handling and validation tests

- **Server Info Page Redesign**: Complete redesign of server-info page with real-time monitoring
  - 2-column layout: left column for server info (compact), right column for server logs
  - Compact server configuration display (Network, SMTP, HTTP settings)
  - "Server Settings" placeholder block with Diagnostics button
  - "Back to Inbox" button moved to top of page
  - Display all SMTP/SMTPS logs in real-time with auto-refresh capability
  - Real-time log fetching via `/logs.json` API endpoint (1 second refresh)
  - Auto-refresh toggle button (ON/OFF) with intelligent resume
  - Searchable/filterable log display with same design as transcript view
  - Show session ID in each log entry with truncation (e.g., a89f3657...)
  - Tippy.js tooltip with full session ID and copy-to-clipboard button
  - Copy button shows checkmark feedback and resets after 2 seconds

### Changed

- Removed Active Connections section from UI
- Enhanced database query methods with `all_transcript_entries` for fetching full log details
- Updated `delete!` method to clear both messages and SMTP transcripts

### Technical Details

- New API endpoint: `/logs.json` for real-time log fetching
- Extended database access methods in `lib/mail_catcher/mail.rb` with `all_transcript_entries`
- Updated views/server-info.erb with new layout and real-time capabilities
- Added auto-refresh state management for log display
- Integrated Tippy.js for session ID tooltips with copy functionality

## [1.3.2] - 2026-01-12

### Added

- **Message List Sorting**: Add sorting/ordering functionality for message list
  - Sortable column headers for From, To, Subject, and Received date
  - Click headers to sort ascending (A→Z or oldest→newest)
  - Click again to sort descending (Z→A or newest→oldest)
  - Click different column to switch sort field
  - Visual indicators with up/down arrow icons showing active sort field and direction
  - Arrow icons highlight in blue when active
  - Full integration with existing search and attachment filter functionality

### Technical Details

- New sorting methods in MailCatcher class:
  - `setSortField()`: Handle sort field selection and direction toggling
  - `sortMessages()`: Reorder table rows based on selected column and direction
  - `getSortValue()`: Extract comparable values from table cells
  - `compareSortValues()`: Case-insensitive string comparison and date parsing
  - `updateSortIndicators()`: Manage visual indicators for active sort state
- Enhanced table header structure with dual SVG icons (up/down arrows)
- New CSS styling for sortable headers with hover and active states
- Sort state properties: `currentSortField` and `currentSortDirection`

## [1.3.1] - 2026-01-11

### Added

- **Code Modularization**: Refactored views/index.erb to separate CSS and JavaScript concerns
  - Extracted 1305 lines of inline CSS to `assets/stylesheets/mailcatcher.css`
  - Modularized 507 lines of JavaScript into focused ES6 modules in `assets/javascripts/modules/`
  - Created modular architecture: utils, resizer, ui-handlers, and tooltips modules
  - Maintained full backward compatibility with all existing features

### Changed

- **Improved Plain Text Email Display**:
  - Added styled background color (#f5f5f5) matching source tab aesthetic
  - Applied monospace font for better readability (Monaco, Courier New, Consolas)
  - Added proper padding (20px 28px) to match spacing in other tabs
  - Increased line-height to 1.6 for improved text readability
  - Set explicit text color for better contrast
- Updated views/index.erb from 1992 to 181 lines by extracting CSS and JavaScript
- Refactored JavaScript to use namespace pattern (window.MailCatcherUI) for modules
- Updated Rakefile with selective minification to support modern ES6+ syntax

### Technical Details

- New CSS file: `assets/stylesheets/mailcatcher.css` (extracted from index.erb)
- New JS entry point: `assets/javascripts/mailcatcher-ui.js` (Sprockets directives)
- New JS modules in `assets/javascripts/modules/`:
  - `utils.js`: HTML escaping utility
  - `resizer.js`: Message list resize functionality with localStorage persistence
  - `ui-handlers.js`: Button handlers, email count, download, copy source
  - `tooltips.js`: Signature and encryption information tooltips (Tippy.js)
- Enhanced Uglifier configuration with SelectiveUglifier class to skip modern syntax minification
- All 45 tests passing without any breaking changes

## [1.3.0] - 2026-01-11

### Added
- **SMTP Transcript Feature**: Complete protocol-level logging for all SMTP and SMTPS connections
  - Log every SMTP command and server response with millisecond-precision timestamps
  - Capture full connection details (client/server IP addresses and ports)
  - Track TLS/SSL session information including protocol version and cipher suite
  - Generate unique session IDs for each SMTP connection for easier debugging
  - Store complete transcript as JSON in SQLite database, automatically linked to each email
  - Web UI "Transcript" tab displaying formatted SMTP session logs
  - Search/filter functionality for transcript entries to find specific commands or responses
  - Color-coded entry types (connection, command, response, TLS, data, error) for visual scanning
  - Direction indicators (→ for client, ← for server) to clearly show message flow

### Changed
- Updated version to 1.3.0 to reflect major feature addition

### Technical Details
- New SQLite table `smtp_transcript` with foreign key relationship to messages
- New API endpoint `/messages/:id.transcript` for HTML transcript display
- New API endpoint `/messages/:id/transcript.json` for JSON data access
- New ERB template `views/transcript.erb` for transcript rendering
- Extended SMTP server logging in `lib/mail_catcher/smtp.rb` to capture all protocol events
- Added database schema and access methods in `lib/mail_catcher/mail.rb`
- Web API now includes "transcript" in message formats array

## [1.2.0] - 2026-01-10

### Added
- **Modern UI Redesign**: Complete redesign of the MailCatcher web interface
  - Responsive flexbox-based layout that adapts to different screen sizes
  - Improved visual hierarchy with better typography and spacing
  - Professional color scheme with better contrast and readability
  - Smooth transitions and hover effects for better user experience

- **Enhanced Email Display**: Better formatting and presentation of received emails
  - Tabbed interface for switching between HTML, Plain Text, and Source views
  - Improved syntax highlighting for email source code
  - Better handling of multipart emails and MIME types
  - Enhanced attachment display with file type icons and metadata

- **Message Management**: Improved message handling and organization
  - Real-time email count display
  - Better message selection and navigation
  - Improved handling of large email bodies
  - More efficient message storage and retrieval

- **WebSocket Integration**: Real-time updates for email delivery
  - Live message list updates without page refresh
  - Real-time notification of new emails using WebSocket
  - Connection status indicator with automatic reconnection

- **Authentication Information Display**: Enhanced email authentication visualization
  - Display SPF, DKIM, and DMARC authentication results
  - Show BIMI (Brand Indicators for Message Identification) location
  - S/MIME and PGP encryption detection and display
  - Detailed authentication header parsing

- **Performance Improvements**:
  - Optimized SQLite queries with proper indexing
  - Efficient asset loading and caching
  - Improved JavaScript event handling
  - Better memory management for large email lists

### Changed
- Updated version to 1.2.0
- Significantly refactored views/index.erb for modern responsive design
- Updated CoffeeScript for better UI interactions
- Improved CSS organization and maintainability

### Fixed
- Better handling of special characters in email addresses
- Improved stability with large attachments
- Fixed UI issues with very long email subjects
- Improved mobile browser compatibility

---

## Notes on Future Versions

### Version 1.3.1
Expected improvements to `views/index.erb`:
- Extract inline styles to separate CSS sections
- Modularize template for better readability
- Improve template logic organization
- Optimize rendering performance

### Version 1.3.2
Message list ordering features:
- Sort messages by recipient (To field)
- Sort messages by sender (From field)
- Sort messages by subject line
- Sort messages by received date (ascending/descending)
- Persist user's sort preference in browser storage

### Version 1.3.3
Testing infrastructure:
- Add unit tests for SMTP transcript functionality
- Add integration tests for message handling
- Add UI tests for transcript display
- Improve test coverage for edge cases
- Add performance benchmarks
