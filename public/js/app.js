var app = angular.module('baseball', []);

app.directive("barsparkline", function() {
    return {
        restrict:"E",
        scope:{
            data:"@"
        },
        compile: function(tElement,tAttrs,transclude){
            tElement.replaceWith("<span>"+tAttrs.data+"</span>");
            return function(scope, element, attrs){
                attrs.$observe("data", function(newValue){
                    element.html(newValue);
                    element.sparkline('html',{type:'bar', height:34, barWidth:21, chartRangeMax:window.max_runs_score});
                });
            };
        }
    };
});

function StatsCtrl($scope,$http){
	$scope.grab_batters = function(){
		$http.get("/api/batters/"+$scope.selected_year.value+".json").success(function(d){
			$scope.players = d.players;
			for(var i = 0;i < $scope.players.length; i++){
				$scope.players[i].score = $scope.calc_score($scope.players[i]);
				$scope.players[i].name  = $scope.players[i][0];
				$scope.players[i].pos   = $scope.players[i][1];
				$scope.players[i].team  = $scope.players[i][2];
			}
		});
	}
	$scope.show_details = function(player){
		$scope.selected_player = player;
		var t = $scope.score_list(player);
		$(".spark").html("");
		$(".spark").sparkline(t,{type:'bar', height:34, barWidth:21, chartRangeMax:window.max_runs_score});
		$("#mod").modal('show');
	}
	$scope.score_list = function(player){
		if(player == null)
			return 0;
		return [player.runs_score,player.singles_score,player.doubles_score,player.triples_score,player.homeruns_score,
					 player.hits_score,player.rbis_score,player.walks_score,player.ks_score,player.sbs_score];
	}
	$scope.calc_score = function(player){
		player.runs_score = player[5] * $scope.scoring.runs;
		window.max_runs_score = Math.max(player.runs_score,window.max_runs_score);
		player.singles_score = player[6] * $scope.scoring.singles;
		player.doubles_score = player[7] * $scope.scoring.doubles;
		player.triples_score = player[8] * $scope.scoring.triples;
		player.homeruns_score = player[9] * $scope.scoring.homeruns;
		player.hits_score = (player[6] + player[7] + player[8] + player[9])* $scope.scoring.hits;
		player.rbis_score = (player[10] * $scope.scoring.rbis);
		player.walks_score = (player[11] * $scope.scoring.walks); 
		player.ks_score = (player[12] * $scope.scoring.ks);
		player.sbs_score = (player[13] * $scope.scoring.sbs);
		return player.runs_score + player.singles_score + player.doubles_score + player.triples_score + player.homeruns_score + player.hits_score + 
					 player.rbis_score + player.walks_score + player.ks_score + player.sbs_score;
	}
	$scope.toggle_pts = function(){
		$scope.pts_asc = !$scope.pts_asc;
		$scope.o = "score";
		$scope.asc = $scope.pts_asc;
	}
	$scope.toggle_pos = function(){
		$scope.pos_asc = !$scope.pos_asc;
		$scope.o = "pos";
		$scope.asc = $scope.pos_asc;
	}
	$scope.toggle_name = function(){
		$scope.name_asc = !$scope.name_asc;
		$scope.o = "name";
		$scope.asc = $scope.name_asc;
	}
	$scope.toggle_team = function(){
		$scope.team_asc = !$scope.team_asc;
		$scope.o = "team";
		$scope.asc = $scope.team_asc;
	}
	$scope.pts_asc = false;
	$scope.name_asc = false;
	$scope.pos_asc = false;
	$scope.team_asc = false;
	$scope.scoring = {};
	$scope.scoring.runs = 2;
	$scope.scoring.hits = 0.5;
	$scope.scoring.singles = 1;
	$scope.scoring.doubles = 2;
	$scope.scoring.triples = 3;
	$scope.scoring.homeruns = 4;
	$scope.scoring.rbis = 1.5;
	$scope.scoring.shs = 0.5;
	$scope.scoring.sbs = 2;
	$scope.scoring.walks = 0.5;
	$scope.scoring.ks = -0.25;
	$scope.scoring.gidps = -1.5;
	$scope.scoring.errors = -1;
	$scope.scoring.cycs = 6;
	$scope.scoring.slams = 5;
	$scope.scoring.ips = 1;
	$scope.scoring.wins = 5;
	$scope.scoring.cgs = 4;
	$scope.scoring.shos = 6;
	$scope.scoring.svs = 6;
	$scope.scoring.ers = -1;
	$scope.scoring.pitcher_bbs = -0.25;
	$scope.scoring.pitcher_ks  = 2;
	$scope.scoring.pitcher_gidps = 0.5;
	$scope.scoring.hlds = 5;
	$scope.scoring.nhs = 7;
	$scope.scoring.pgs = 10;
	$scope.scoring.qss = 2;
	$scope.scoring.bsvs = -2;
	$scope.scoring.picks = 0.5;

	window.max_runs_score = 0;
	$scope.years = [{name:'2012',value:'2012'},{name:'2011',value:'2011'}];	
	$scope.selected_year = $scope.years[0];
	$scope.grab_batters();
}
$().ready(function(){
	$("#det").modal('show');
});
