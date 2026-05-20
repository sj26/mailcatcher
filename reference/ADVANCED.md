# Advanced Features

## SSL/TLS Support

MailCatcher NG supports both STARTTLS and direct TLS (SMTPS) for encrypted SMTP connections. This is useful for testing email delivery in staging environments that require secure connections.

### Generate a Self-Signed Certificate

For testing purposes, create a self-signed certificate:

```bash
openssl req -x509 -newkey rsa:4096 -keyout key.pem -out cert.pem -days 365 -nodes
```

This creates:
- `cert.pem`: Certificate file
- `key.pem`: Private key file

### Start MailCatcher NG with SSL/TLS

```bash
mailcatcher --smtp-ssl --smtp-ssl-cert cert.pem --smtp-ssl-key key.pem
```

### Connection Methods

This enables two connection methods:

- **STARTTLS on port 1025**: Plain connections that upgrade via STARTTLS command (required)
- **Direct TLS on port 1465**: Encrypted connections from the start (SMTPS)

**Important:** When SSL/TLS is enabled, STARTTLS is required before sending mail. Clients must complete the TLS upgrade first.

### Client Certificate Verification (Optional)

Enable verification of client SSL certificates (mutual TLS):

```bash
mailcatcher --smtp-ssl --smtp-ssl-cert cert.pem --smtp-ssl-key key.pem --smtp-ssl-verify-peer
```

### Framework Configuration

#### Rails with STARTTLS

```ruby
config.action_mailer.delivery_method = :smtp
config.action_mailer.smtp_settings = {
  address: '127.0.0.1',
  port: 1025,
  enable_starttls_auto: true
}
```

#### Django with TLS

Direct TLS (SMTPS) on port 1465:

```python
if DEBUG:
    EMAIL_HOST = '127.0.0.1'
    EMAIL_PORT = 1465  # Direct TLS
    EMAIL_USE_TLS = True
    EMAIL_USE_SSL = True
```

### Security Considerations

- **Self-signed certificates**: Will trigger warnings in mail clients but work for development
- **Production certificates**: Use proper certificates for staging environments
- **Certificate validation**: Mail clients may show security warnings with self-signed certs
- **Private key protection**: Keep your key.pem file secure and don't commit to version control

## UTF-8 and International Content Support

MailCatcher NG fully supports modern SMTP capabilities for UTF-8 and international content.

### SMTP Capabilities

MailCatcher NG advertises support for:

- **SMTPUTF8 (RFC 6531)**: Allows clients to send UTF-8 directly without encoding
- **8BITMIME (RFC 6152)**: Accepts 8bit transfer encoding for UTF-8 content without base64 overhead
- **Multiple encodings**: 7bit, 8bit, base64, and quoted-printable transfer encodings
- **Charset preservation**: Automatically preserves and displays charset information

### Benefits

Modern mail libraries can send UTF-8 encoded messages directly to MailCatcher NG without additional encoding overhead. This reduces message size and improves compatibility with international content.

### Supported Encodings

- **7bit**: ASCII-only content
- **8bit**: UTF-8 and other 8-bit encodings (RFC 6152)
- **base64**: Binary-safe encoding (traditional fallback)
- **quoted-printable**: Text-optimized encoding

### Character Display

MailCatcher NG properly displays:
- International characters and scripts
- Multiple languages in a single message
- Proper charset detection and preservation
- Emoji and Unicode content

### Testing UTF-8 Content

Use the provided example scripts to test UTF-8 handling:

```bash
SMTP_HOST=127.0.0.1 SMTP_PORT=1025 ruby send_example_emails.rb
```

This sends messages with various UTF-8 encodings for testing and verification.

## Advanced Email Features

### Email Authentication Verification

MailCatcher NG verifies and displays:

- **DMARC (Domain-based Message Authentication, Reporting and Conformance)**: Domain policy enforcement
- **DKIM (DomainKeys Identified Mail)**: Message signature verification
- **SPF (Sender Policy Framework)**: Authorized sender verification

These authentication results are displayed in the web interface.

### Email Encryption and Signatures

MailCatcher NG can display:

- **S/MIME (Secure/Multipurpose Internet Mail Extensions)**: Certificate-based encryption and signatures
- **OpenPGP**: PGP-based encryption and signatures

Both encrypted and signed messages are properly handled and displayed.

### BIMI Support

**Brand Indicators for Message Identification (BIMI)** display authenticated brand logos in email clients. MailCatcher NG supports viewing BIMI data associated with authenticated messages.

### Advanced Preview Text Extraction

MailCatcher NG uses intelligent preview text extraction with a 3-tier fallback system:

1. Explicit preview header (from message metadata)
2. First plain text content (if available)
3. Plain text extraction from HTML (as last resort)

### Enhanced Sender/Recipient Parsing

Improved parsing and display of:
- Sender names and email addresses
- Recipient lists (To, Cc, Bcc)
- Reply-To addresses
- Proper name encoding and display

## Server Logs and SMTP Monitoring

Monitor real-time SMTP protocol interactions between your application and MailCatcher NG. The Server Logs view displays all SMTP commands, responses, and connection events.

### Accessing Server Logs

1. Visit the web interface at `http://127.0.0.1:1080`
2. Click "Server Information" in the sidebar
3. View the "Server Logs" panel on the right

![Server Logs View](/screenshots/logs.webp)

### Log Details

Logs show:

- **Timestamp**: Millisecond-precision event time
- **Session ID**: Unique identifier for each SMTP connection
- **Event Type**: COMMAND, RESPONSE, DATA, or CONNECTION
- **Direction**: Client (→) or server (←) direction
- **Message**: SMTP command, response code, or event details

### Example Log Events

```text
COMMAND    + client    RCPT TO:<recipient@example.com>
RESPONSE   - server    250 OK
DATA       + client    Message complete (1145 bytes)
RESPONSE   - server    354 Start mail input; end with <CRLF>.<CRLF>
CONNECTION - server    Connection established from 127.0.0.1:55044
RESPONSE   - server    250 8BITMIME SMTPUTF8
```

### Auto-refresh

Enable **Auto-refresh: ON** toggle to continuously monitor live connections. Disable to pause and review historical logs.

### Filter Logs

Use the "Filter logs..." search box to find specific:

- Connection IDs
- Command names (RCPT, MAIL, DATA)
- Email addresses
- Response codes (250, 354, 550)
- Custom text patterns

### Debugging SMTP Issues

Server logs are essential for troubleshooting:

- **Connection refused**: Check if MailCatcher is running on `127.0.0.1:1025`
- **AUTH failures**: Verify authentication commands in logs (MailCatcher doesn't require AUTH)
- **Message rejections**: See exact SMTP response codes
- **Protocol errors**: Identify non-standard client behavior
- **UTF-8 issues**: Monitor SMTPUTF8 capability negotiation

## Message Management

### Limit Message Storage

Prevent memory usage from growing unbounded:

```bash
mailcatcher --messages-limit 1000
```

Only the 1000 most recent messages are kept. Older messages are automatically deleted.

### Disable Quit Function

Prevent accidental server shutdown:

```bash
mailcatcher --no-quit
```

Disables the quit button in the web interface and the quit API endpoint.

## HTTP Path Prefix

For reverse proxy or nested deployment scenarios:

```bash
mailcatcher --http-path /mail
```

Access the web interface at `http://127.0.0.1:1080/mail/`

All HTTP resources are served with the specified prefix.

## Keyboard Navigation

The web interface supports keyboard shortcuts for efficient message navigation:
- Arrow keys to move between messages
- Shortcuts for common actions
- See the web interface for full keyboard reference

## Caveats

Mail processing is fairly basic but easily modified. If something doesn't work for you:

1. Fork the project
2. Fix it or add the feature
3. File an [issue](https://github.com/spaquet/mailcatcher/issues) with the complete message
4. Submit a pull request

Include the whole message you're having problems with for diagnosis.
