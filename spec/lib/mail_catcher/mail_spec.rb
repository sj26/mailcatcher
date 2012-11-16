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

  it "should return the message if found" do
    mail = @dummy.messages.first
    @dummy.stub(:deliver).and_return({:to => "to_address", :from => "from_address" , :message_id => "message_id"})
    delivered_msg = @dummy.deliver_message(mail['id'])
    delivered_msg.should_not be nil
    delivered_msg.should be_eql ({:to => "to_address", :from => "from_address" , :message_id => "message_id"})
  end

  it "should call deliver method with a message as param" do
    mail = @dummy.messages.first
    @dummy.should_receive(:deliver).with(mail)    
    delivered_msg = @dummy.deliver_message(mail['id'])    
  end

  context "return error when mail wasn't sent" do
    it "should return error if message does not exist" do
      @dummy.deliver_message("Test Id").should be_eql ({:error=>{:message => "No message match the specified ID."}})
      @dummy.deliver_message(nil).should be_eql ({:error=>{:message => "No ID was specified."}})      
    end
    
    it "should return error if message is missing source" do
      message = {
        :sender=>"<test@example.com>", 
        :recipients=>["<reply-abcdef1234@mail.vresp.com>"], 
        :source=>""
      }
      id = @dummy.add_message message 
      msg = @dummy.messages.last
      val = @dummy.deliver_message(msg['id'])
      val.should be_eql ({:error=>{:message => "Mail's source is not specified"}})
    end
  end

  context "successfully sending a message using Mail" do 

    before(:each) do 
      @msg = @dummy.messages.first
      @mail = mock('mail')
      @mail.stub(:from).and_return(["sender@test.com"]) 
      @mail.stub(:to).and_return(["recipient@test.com"]) 
      @mail.stub(:message_id).and_return("message_id_pattern")     
      @mail.stub(:deliver!)
      ::Mail.stub(:new).and_return(@mail)
    end 

    it "should call the deliver method to send the message" do
      @mail.should_receive(:deliver!).once
      @dummy.deliver(@msg)
    end

    it "should return a hash with the message information after delivering it" do
      result_hash = @dummy.deliver(@msg)
      result_hash.should be_eql({ :from => "sender@test.com",
                                  :to => "recipient@test.com",
                                  :message_id => "message_id_pattern"})
    end

  end

end