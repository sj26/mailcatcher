# mailcatcher has had a long-standing issue whereby it doesn't handle
# multiple mails over the same connection. This is actually a problem
# with the SMTP server in EventMachine itself, but the fix still hasn't
# been merged into EM yet.  There's an open pull request, and the
# easiest way is to monkey-patch what we need.  For more details:
# https://github.com/railsware/eventmachine/commit/a23d4828

module EventMachine
  module Protocols
    class SmtpServer

      def process_data_line ln
        if ln == "."
          if @databuffer.length > 0
            receive_data_chunk @databuffer
            @databuffer.clear
          end

          succeeded = proc {
            send_data "250 Message accepted\r\n"
          }
          failed = proc {
            send_data "550 Message rejected\r\n"
          }

          d = receive_message

          if d.respond_to?(:set_deferred_status)
            d.callback(&succeeded)
            d.errback(&failed)
          else
            (d ? succeeded : failed).call
          end

          # this is the line we actually need
          @state -= [:data, :mail_from, :rcpt]

        else
          # slice off leading . if any
          ln.slice!(0...1) if ln[0] == 46
          @databuffer << ln
          if @databuffer.length > @@parms[:chunksize]
            receive_data_chunk @databuffer
            @databuffer.clear
          end
        end
      end

    end
  end
end
