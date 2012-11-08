require 'spec_helper'
require 'mail_catcher'
require 'mail_catcher/mail'

describe MailCatcher::Mail do
  class DummyClass  
  end

  before(:all) do
    @dummy = DummyClass.new
    @dummy.extend MailCatcher::Mail
  end

  before(:each) do 
    @message = {
      :sender=>"<test@example.com>", 
      :recipients=>["<reply-abcdef1234@mail.vresp.com>"], 
      :source=>"From: <test@example.com>\nTo: <reply-abcdef1234@mail.vresp.com>\nDate: 
              Wed,  7 Nov 2012 13:52:01 -0800 (PST)\nMessage-Id: <51ea.0003.fffffff8@host-198-17-0-10.sfoffice.verticalresponse.com>\nSubject: subject_test\n\nbody test\n"
    }
    @dummy.add_message @message #1
  end

  it "should delete one specific message" do
    mail = @dummy.messages.first
    @dummy.add_message @message # Adding 2nd email
    @dummy.delete_message! mail['id']
    @dummy.message(mail['id']).should be nil
    @dummy.messages.should_not be_empty 
  end

  it "should bounce one specific message" do
    mail = @dummy.messages.first
    @dummy.add_message @message # Adding 2nd email

    MailCatcher::SimpleLogger.should_receive(:bounce).with(mail['id'])
    @dummy.bounce_message mail['id']
    @dummy.message(mail['id']).should be nil
    @dummy.messages.should_not be_empty
  end

end