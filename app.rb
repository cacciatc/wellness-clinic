require 'sinatra'
require 'json'

configure do
	REDIS = {}

	def load_year(year,category)
		data    = File.open("public/stats/#{category}_#{year}.json").readlines.join
		players = JSON.parse(data)["players"]
		
		h = {}
		players.each do |p|
			# key is team and name
			if category == "batters"
				team, name = p[2], p[0]
			else
				team, name = p[1], p[0]
			end
			h[team] = h[team] || {}
			h[team][name] = p
		end
		h
	end
	
	# load years
	REDIS["2012-batters"]  = load_year("2012", "batters")
	REDIS["2012-pitchers"] = load_year("2012", "pitchers")
	
	REDIS["2011-batters"]  = load_year("2011", "batters")
	REDIS["2011-pitchers"] = load_year("2011", "pitchers")
	
	REDIS["2010-batters"]  = load_year("2010", "batters")
	REDIS["2010-pitchers"] = load_year("2010", "pitchers")
	
	REDIS["2009-batters"]  = load_year("2009", "batters")
	REDIS["2009-pitchers"] = load_year("2009", "pitchers")
	
	REDIS["2008-batters"]  = load_year("2008", "batters")
	REDIS["2008-pitchers"] = load_year("2008", "pitchers")
end

get '/' do
	send_file 'views/app.html'
end

get '/api/batters/:year.json' do |year|
	File.open("public/stats/batters_#{year}.json").readlines.join
end

get '/api/pitchers/:year.json' do |year|
	File.open("public/stats/pitchers_#{year}.json").readlines.join
end

get '/api/batters/:name/:team.json' do |name,team|
	results = []
	REDIS.each do |key,value|
		if key =~ /[0-9]+\-batters/
			begin
				player = value[team][name]
				if not player.nil?
					results << player
				end
			rescue;end
		end
	end
	results.to_s
end

get '/api/pitchers/:name/:team.json' do |name,team|
	results = []
	REDIS.each do |key,value|
		if key =~ /[0-9]+\-pitchers/
			begin
				player = value[team][name]
				if not player.nil?
					results << player
				end
			rescue;end
		end
	end
	results.to_s
end
