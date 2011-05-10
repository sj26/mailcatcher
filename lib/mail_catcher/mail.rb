require 'mail'
require 'sqlite3'
require 'eventmachine'

module MailCatcher::Mail
  class << self
    def db
      @@__db ||= begin
        SQLite3::Database.new(':memory:', :results_as_hash => true, :type_translation => true).tap do |db|
          db.execute(<<-SQL)
            CREATE TABLE message (
              id INTEGER PRIMARY KEY ASC,
              sender TEXT,
              recipients TEXT,
              subject TEXT,
              source BLOB,
              size TEXT,
              created_at DATETIME DEFAULT CURRENT_DATETIME
            )
          SQL
          db.execute(<<-SQL)
            CREATE TABLE message_part (
              id INTEGER PRIMARY KEY ASC,
              message_id INTEGER NOT NULL,
              cid TEXT,
              type TEXT,
              is_attachment INTEGER,
              filename TEXT,
              charset TEXT,
              body BLOB,
              size INTEGER,
              created_at DATETIME DEFAULT CURRENT_DATETIME
            )
          SQL
        end
      end
    end
    
    def add_message(message)
      @@add_message_query ||= db.prepare("INSERT INTO message (sender, recipients, subject, source, size, created_at) VALUES (?, ?, ?, ?, ?, datetime('now'))")
      
      mail = Mail.new(message[:source])
      result = @@add_message_query.execute(message[:sender], message[:recipients].inspect, mail.subject, message[:source], message[:source].length)
      message_id = db.last_insert_row_id
      parts = mail.all_parts
      parts = [mail] if parts.empty?
      parts.each do |part|
        body = part.body.to_s
        # Only parts have CIDs, not mail
        cid = part.cid if part.respond_to? :cid
        add_message_part(message_id, cid, part.mime_type || 'text/plain', part.attachment? ? 1 : 0, part.filename, part.charset, body, body.length)
      end
      
      EventMachine.next_tick do
        message = MailCatcher::Mail.message message_id
        MailCatcher::Events::MessageAdded.push message
      end
    end

    def add_message_part(*args)
      @@add_message_part_query ||= db.prepare "INSERT INTO message_part (message_id, cid, type, is_attachment, filename, charset, body, size, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))"
      @@add_message_part_query.execute(*args)
    end
    
    def latest_created_at
      @@latest_created_at_query ||= db.prepare "SELECT created_at FROM message ORDER BY created_at DESC LIMIT 1"
      @@latest_created_at_query.execute.next
    end
    
    def messages
      @@messages_query ||= db.prepare "SELECT id, sender, recipients, subject, size, created_at FROM message ORDER BY created_at DESC"
      @@messages_query.execute.to_a
    end
    
    def message(id)
      @@message_query ||= db.prepare "SELECT * FROM message WHERE id = ? LIMIT 1"
      @@message_query.execute(id).next
    end
    
    def message_has_html?(id)
      @@message_has_html_query ||= db.prepare "SELECT 1 FROM message_part WHERE message_id = ? AND is_attachment = 0 AND type = 'text/html' LIMIT 1"
      !!@@message_has_html_query.execute(id).next
    end
    
    def message_has_plain?(id)
      @@message_has_html_query ||= db.prepare "SELECT 1 FROM message_part WHERE message_id = ? AND is_attachment = 0 AND type = 'text/plain' LIMIT 1"
      !!@@message_has_html_query.execute(id).next
    end
    
    def message_parts(id)
      @@message_parts_query ||= db.prepare "SELECT cid, type, filename, size FROM message_part WHERE message_id = ? ORDER BY filename ASC"
      @@message_parts_query.execute(id).to_a
    end
    
    def message_attachments(id)
      @@message_parts_query ||= db.prepare "SELECT cid, type, filename, size FROM message_part WHERE message_id = ? AND is_attachment = 1 ORDER BY filename ASC"
      @@message_parts_query.execute(id).to_a
    end
    
    def message_part(message_id, part_id)
      @@message_part_query ||= db.prepare "SELECT * FROM message_part WHERE message_id = ? AND id = ? LIMIT 1"
      @@message_part_query.execute(message_id, part_id).next
    end
    
    def message_part_type(message_id, part_type)
      @@message_part_type_query ||= db.prepare "SELECT * FROM message_part WHERE message_id = ? AND type = ? AND is_attachment = 0 LIMIT 1"
      @@message_part_type_query.execute(message_id, part_type).next
    end
    
    def message_part_html(message_id)
      message_part_type message_id, "text/html"
    end
    
    def message_part_plain(message_id)
      message_part_type message_id, "text/plain"
    end
    
    def message_part_cid(message_id, cid)
      @@message_part_cid_query ||= db.prepare 'SELECT * FROM message_part WHERE message_id = ?'
      @@message_part_cid_query.execute(message_id).find { |part| part["cid"] == cid }
    end
  end
end