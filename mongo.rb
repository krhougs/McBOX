require 'mongoid'
Mongoid.load!(settings.config_dir + "/mongoid.yml")
class Machine
	include Mongoid::Document
	store_in collection: "machines"
	field :texts, type: String
	field :time, type: Time
	field :belong_to
	field :status, type: String
	field :address
	field :port
	field :user
	field :pass
	field :salt
	validates_presence_of :belong_to, :address, :port, :user, :pass, :salt
end
class Ticket
	include Mongoid::Document
	store_in collection: "tickets"
	field :title, type: String
	field :user, type: String
	field :time, type: Time, :default => Time.now
	field :texts
	field :status, :default => "open"
	embeds_many :replies
	validates_presence_of :title,:user,:texts,:status
end
class Reply
	include Mongoid::Document
	store_in collection: "replies"
	field :user
	field :time, type: Time, :default => Time.now
	field :texts
	embedded_in :ticket
	validates_presence_of :user, :texts
end
class Setting
	include Mongoid::Document
	store_in collection: "settings"
	field :title, type: String
	field :data, type: String
	validates_presence_of :title
	validates_uniqueness_of :title
end