# -*- coding:utf-8 -*-
require "rubygems"
require "bundler/setup"
require "slim"
require "coffee-script"
require 'digest/sha1'
require 'digest/md5'
require 'json'
require 'rack-flash'
require 'sinatra'
require "sinatra/reloader"
require "sinatra_more/markup_plugin"
require "sinatra_more/render_plugin"
require "sinatra_more/routing_plugin"
require 'padrino-helpers'
require "minecraft-jsonapi"
register SinatraMore::MarkupPlugin
register SinatraMore::RenderPlugin
register SinatraMore::RoutingPlugin
register Sinatra::Reloader
use Rack::Session::Cookie
use Rack::Flash
configure do
    set :template_engine, "slim" # for example
end
set :config_dir , settings.root + "/config"
set :views, settings.root + '/ui'
set :public_folder, settings.root + '/assets'
set :config , JSON.parse(File.open(settings.config_dir + "/config.json").read)
$admins = settings.config["adminmail"]
require 'sinatra/r18n'
R18n::I18n.default = 'en'
R18n.default_places { "#{settings.root}/i18n/" }
before do
  session[:locale] = params[:locale] if params[:locale]
end
require 'maruku'
require settings.root + '/mongo'
require "sinatra-authentication-o"
set :sinatra_authentication_view_path, settings.root + '/ui'
require settings.root + '/load_modules'
require settings.root + '/routes'
