module Mcbox
end
module Mcbox::Helpers
	module Post
	end
	module Setties
		def get_db_settings(id)
			@s = Setting.where(title: id)
			if @s.exists?
				@s[0].data
			else
				false
			end
		end
		def admin?
			$admins.include?(current_user.email)
		end
		def admin_zone
			if $admins.include?(current_user.email) != true
				redirect "/"
			end
		end
	end
	module Craft
		def get_server_api(id)
			@api = nil
			@machine = Machine.where(_id: id)
			if @machine.exists?
				@api = ::Minecraft::JSONAPI.new(
					host: @machine[0].address,
					port: @machine[0].port,
					username: @machine[0].user,
					password: @machine[0].pass,
					salt: @machine[0].salt) if @machine[0].status == "ok"
			end
			flash[:notice] = "Can't Get API" if @api == nil
			@api
		end
		def my_server(i)
			@m = Machine.where(_id: i)
			@a = nil
			if @m.exists?
				@a = true if admin? || @m[0].belong_to == current_user.name
			redirect "/" if @a == nil
			end
		end
		def my_server?(i)
			@m = Machine.where(_id: i)
			@a = false
			if @m.exists?
				@a = true if admin? || @m[0].belong_to == current_user.name
			end
			@a
		end
		def online?(api)
	      	status = true
	      	begin
	        	api.getServer.to_s
		    rescue
		    	status = false
		    end
		    status
		end
	end
end
helpers Mcbox::Helpers::Setties, Mcbox::Helpers::Craft