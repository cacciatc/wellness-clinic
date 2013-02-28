require 'sinatra'
require 'json'

get '/' do
	send_file 'views/app.html'
end

get '/api/batters/:year.json' do |year|
	File.open("public/stats/batters_#{year}.json").readlines.join
end
