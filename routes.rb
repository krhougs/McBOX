get "/" do
	if logged_in?
		redirect "/my"
	else
		redirect "/login"
	end
end
get "/my" do
	redirect "/my/summary"
end
get "/my/summary" do
	login_required
	@machines = Machine.where(belong_to: current_user.name)
	@my_machine = nil
	@my_machine = @machines[0] if @machines.exists?
	@tickets = Ticket.where(user: current_user.name)
	@my_ticket = nil
	@my_ticket = @tickets if @tickets.exists?
	slim :my_summary
end
#Ticket
get "/ticket/new/*" do |u|
	login_required
	@u = u
	slim :new_tk
end
post "/ticket/close/*" do |u|
	login_required
	@t = Ticket.where(_id: u)
	if @t.exists?
		if admin? || @t[0].user == current_user.name
			@t.update(status: "close")
			"Success"
		end
	end
end
get "/ticket/:id" do |i|
	login_required
	@t = Ticket.where(id: i)
	if @t.exists?
		slim :view_tk if admin? || @t[0].user == current_user.name
	else
		halt 404
	end
end
post "/ticket" do
	login_required
	@t = params[:topic]
	if admin? || @t["user"] == current_user.name
		if @t["action"] == "new"
			@d = Ticket.new @t
			@d.save
			if @d.valid? && @d.id
				redirect "/ticket/#{@d.id}"
			else
				redirect "/ticket/new/#{@t.user}"
				flash[:error] = @d.errors
			end
		end
		if @t["action"] == "reply"
			Ticket.where(_id: @t["ticket_id"]).first.replies.create @t
			redirect "/ticket/#{@t["ticket_id"]}"
		end
	else
		halt 401, 'go away!'
	end
end
#Server Managing
require "./routes_server"
#Administration
get "/admin/home" do
	login_required
	admin_zone
	@a = i18n.admin.title(i18n.admin.home)
	@tickets = Ticket.where(status: "open")
	slim :admin_home
end
get "/admin/user" do
	login_required
	admin_zone
	@users = MongoidUser
	@a = i18n.admin.title(i18n.admin.user(@users.count))
	slim :admin_user
end
get "/admin/user/:u" do |u|
	admin_zone
	login_required
	if admin?
		@i = MongoidUser.where(name: u)
		if @i.exists?
			@u = @i[0]
			@t = nil
			@t = Ticket.where(user: u) if Ticket.where(user: u).exists?
		else
			flash[:notice] = "User #{u} doesn't exists."
		end
	end
	slim :user_settings
end
post "/admin/pass/*" do |u|
	login_required
	@u = u
	@u = current_user.name if u.to_s == ""
    redirect "/" unless admin? || @u.name.to_s == u
    user = User.get(:id => MongoidUser.where(name: @u)[0].id)
    user_attributes = params[:user]
    if user.update(user_attributes)
        if Rack.const_defined?('Flash')
            flash[:notice] = i18n.admin.pass
        end
        redirect "/admin/user/#{@u}" if @u == u
        redirect "/" if @u != u
    else
        if Rack.const_defined?('Flash')
            flash[:error] = "#{user.errors}"
        end
	    redirect "/admin/user/#{@u}" if @u == u
		redirect "/" if @u != u
    end
end
post "/admin/user/:u" do |u|
	admin_zone
	login_required
	if admin?
		@i = MongoidUser.where(name: u)
		if @i.exists?
			@i[0].delete
			"Success"
		else
			"User #{u} doesn't exists."
		end
	end
end
get "/admin/server" do
	login_required
	admin_zone
	@machines = Machine
	@a = i18n.admin.title(i18n.admin.server(@machines.count))
	
	slim :admin_server
end
post "/server/delete/:id" do |i|
	login_required
	admin_zone
	if admin?
		@m = Machine.where(id: i)
		if @m.exists?
			@m[0].delete
			"Success"
		else
			"Not Exists"
		end
	end
end
post "/admin/apply" do
	login_required
	admin_zone
	@titles = params[:titles].split(",")
	@page = "/admin/" + params[:page]
	@titles.each do |ti|
		if get_db_settings(ti) == false
			Setting.create!(title: ti,data: params[ti])
		else
			Setting.where(title: ti).update(data: params[ti])
		end
		flash[:notice] = i18n.titles.admin_su(ti)
	end
	redirect @page
end