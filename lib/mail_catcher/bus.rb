# frozen_string_literal: true

module MailCatcher
  # Async-friendly broadcast channel
  class Channel
    def initialize
      @subscription_id = 0
      @subscriptions = {}
    end

    def subscriber_count
      @subscriptions.size
    end

    def push(*values)
      Async.run do
        values.each do |value|
          @subscriptions.each_value do |subscription|
            Async do
              subscription.call(value)
            end
          end
        end
      end
    end

    def subscribe(&block)
      subscription_id = next_subscription_id

      @subscriptions[subscription_id] = block

      subscription_id
    end

    def unsubscribe(subscription_id)
      @subscriptions.delete(subscription_id)
    end

    private

    def next_subscription_id
      @subscription_id += 1
    end
  end

  # Then we instantiate a global one
  Bus = Channel.new
end
