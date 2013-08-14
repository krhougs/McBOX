require "base64"
get "/server/:id" do |i|
	login_required
	redirect "/server/home/" + i
end
post "/server/new" do
	login_required
	admin_zone
	if admin?
		@p = params[:machine]
		@p["time"] = Time.now
		@p["status"] = "ok"
        machine = Machine.new @p
        machine.save
        if machine.valid? && machine.id
          if Rack.const_defined?('Flash')
            flash[:notice] = "Machine created: #{machine.id}"
          end
          redirect "/server/#{machine.id}"
        else
          if Rack.const_defined?('Flash')
            flash[:error] = "There were some problems creating machine: #{machine.errors}."
          end
          redirect '/admin/server'
        end
	end
	
end
post "/server/upload/:id" do
	login_required
	my_server params[:id]
	@a = get_server_api params[:id]
	if online? @a
		@file = params[:Filedata][:tempfile]
		if @file.size < 1300000	
			@b64 = Base64.encode64 @file.read
			@size = @file.size
			@arr = @a.getDirectory("./plugins/")
			if @arr.include? "./plugins/#{params[:Filename]}"
				@info = @a.fs {|f|f.writeBinary "./plugins/#{params[:Filename]}",@b64}
			else
				@a.fs {|f|f.createFile "./plugins/#{params[:Filename]}"}
				@info = @a.fs {|f|f.writeBinary "./plugins/#{params[:Filename]}",@b64}
			end
		else
			@info = "too_big"
		end
		@file.close
	else
		"not_online"
	end
	@info
end
post "/server/apply/:id" do
	login_required
	my_server params[:id]
	@a = get_server_api params[:id]
	if online? @a
		@b = @a.send params[:action], params[:with]
		@b.to_s
	else
		"not_online"
	end
end
get "/javascripts/:id.js" do |i|
	content_type 'text/javascript'
	@i = i
	@a = get_server_api i
	erb :server_js
end
get "/server/home/*" do |i|
	@i = i
	@b = i18n.server.titles.ti(i18n.server.titles.home)
	login_required
	my_server i
	@api_s = get_server_api i
	redirect "/" if @api_s == nil
	@online = online? @api_s
	slim :server_home
end
get "/server/game/*" do |i|
	@i = i
	@b = i18n.server.titles.ti(i18n.server.titles.game)
	login_required
	my_server i
	@api_s = get_server_api i
	redirect "/" if @api_s == nil
	@online = online? @api_s
	slim :server_game
end
get "/server/user/*" do |i|
	@i = i
	@b = i18n.server.titles.ti(i18n.server.titles.user)
	login_required
	my_server i
	@api_s = get_server_api i
	redirect "/" if @api_s == nil
	@online = online? @api_s
	slim :server_user
end
get "/server/mod/*" do |i|
	@i = i
	@b = i18n.server.titles.ti(i18n.server.titles.mod)
	login_required
	my_server i
	@api_s = get_server_api i
	redirect "/" if @api_s == nil
	@online = online? @api_s
	slim :server_mod
end
get "/server/other/*" do |i|
	@i = i
	@b = i18n.server.titles.ti(i18n.server.titles.other)
	login_required
	my_server i
	@api_s = get_server_api i
	redirect "/" if @api_s == nil
	@online = online? @api_s
	slim :server_other
end