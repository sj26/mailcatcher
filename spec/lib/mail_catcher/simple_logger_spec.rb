require 'spec_helper'
require 'mail'
require 'mail_catcher'
require 'mail_catcher/mail'
require 'mail_catcher/simple_logger'


describe MailCatcher::SimpleLogger do
  class DummyClass  
  end

  before(:all) do
    @mail_dummy = DummyClass.new
    @mail_dummy.extend MailCatcher::Mail
    MailCatcher::setup_logger
    MailCatcher.logger.level = Logger::ERROR
    
    @logger_dummy = DummyClass.new    
    @logger_dummy.extend MailCatcher::SimpleLogger
  end
  
  before(:each) do 
    @message = {
      :sender=>"<test@example.com>", 
      :recipients=>["<reply-abcdef1234@mail.vresp.com>"], 
      :source=>"From: <test@example.com>\nTo: <reply-abcdef1234@mail.vresp.com>\nDate: Wed,  7 Nov 2012 13:52:01 -0800 (PST)\nMessage-Id: <51ea.0003.fffffff8@host-198-17-0-10.sfoffice.verticalresponse.com>\nSubject: subject_test\n\nbody test\n"
    }
    @mail_dummy.add_message @message #1
  end  
  
  it "should create a bounce log" do 
    local_message = @mail_dummy.messages.first
    mail_obj = ::Mail.new(local_message['source'])
    
    ::Mail.stub(:new).and_return(mail_obj)
    
    MailCatcher::Mail.stub(:message).and_return(local_message)
    time = mock('time')
    time.stub(:to_i).and_return(123)
    Time.stub(:now).and_return(time)
        
    $stdout.should_receive(:puts).with("Bounce Event")    
    $stdout.should_receive(:puts).with("#{Time.now.to_i}@#{mail_obj.message_id}@#{mail_obj.message_id}@#{mail_obj.message_id}@B@#{mail_obj.to.first}@#{mail_obj.from.first}@binding_group@binding@21@40@#{local_message['size']}@#{ENV["HOSTNAME"]}@Bounce Event enforced by user")        
    @logger_dummy.bounce(local_message['id'])
  end  

  it "should not log if email does not exist" do
    MailCatcher::Mail.stub(:message).and_return(nil)
    $stdout.should_receive(:puts).once.with("Bounce Event: no email found.")  
    id = mock('message_id')
    @logger_dummy.bounce(id)
  end 

end
