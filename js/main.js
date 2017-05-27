var app = angular.module('storyApp', []).controller('story-cont', function($scope, $http, $q) {
  $scope.prd = true;
  $scope.remWrdsStart = 123;
  //first, bg
  $http.get('https://api.guildwars2.com/v2/specializations/' + Math.floor(Math.random() * 54)).then(function(bg) {
    console.log('BGL', bg)
    $scope.bg = bg.data.background;
  })
  $http.get('https://api.guildwars2.com/v2/stories').then(function(r) {
    var proms = [];
    $scope.fullDesc = allStories;
    r.data.forEach(function(s) {
      proms.push($http.get('https://api.guildwars2.com/v2/stories/' + s));
    });
    $q.all(proms).then(function(d) {
      d.forEach(function(sd) {
        if (sd.data.description && sd.data.description.indexOf('<c') < 0) {
          $scope.fullDesc += sd.data.description;
        }
      });
      $scope.processDescs($scope.fullDesc);
    });
  });
  $scope.remWrds = 50; //words remaining in construction
    $scope.currWrd = 'the'; //current word seed;
    $scope.fullOut = '(None yet!)';
    $scope.sampSize = 1;
  $scope.processDescs = function(des) {
    des = des || $scope.fullDesc;
    var simped = '';
    if (!$scope.prd) {
      simped = des.replace(/[^A-Za-z0-9\s']/g, ' ').toLowerCase();
    } else {
      simped = des.replace(/[^A-Za-z0-9\s'\.]/g, ' ').toLowerCase();
    }
    $scope.wordList = {};
    $scope.allWords = simped.split(' ').filter(function(r) {
      return r.match(/[^\s]/g);
    }).map(function(nosix) {
      if (nosix.indexOf('06') > -1) {
        return nosix.slice(2);
      } else {
        return nosix;
      }
    });
    //now process with sample sizing
    var tempArr = [];
    for (var k=0;k<$scope.allWords.length;k+=$scope.sampSize){
      var thisCurrWrd = '';
      for (var q=0;q<$scope.sampSize;q++){
        if($scope.allWords[k+q]){
          thisCurrWrd+=$scope.allWords[k+q]+' ';
        }
      }
      tempArr.push(thisCurrWrd.trim());
    }
    $scope.allWords = tempArr;
    //and finally do markov stuff!
    for (var i = 0; i < $scope.allWords.length; i++) {
      if (!$scope.wordList[$scope.allWords[i].trim()]) {
        $scope.wordList[$scope.allWords[i].trim()] = {};
      }
      if ($scope.allWords[i + 1]) {
        //has following word
        if (!$scope.wordList[$scope.allWords[i].trim()][$scope.allWords[i + 1].trim()]) {
          $scope.wordList[$scope.allWords[i].trim()][$scope.allWords[i + 1].trim()] = 1;
        } else {
          $scope.wordList[$scope.allWords[i].trim()][$scope.allWords[i + 1].trim()]++;
        }
      }
    }
    console.log($scope.wordList)
      //got all word freq lists;
    $scope.fullWords = [];
    $scope.allWords.forEach(function(aw) {
      if ($scope.fullWords.indexOf(aw) < 0) {
        $scope.fullWords.push(aw);
      }
    });
    $scope.fullWords = $scope.fullWords.sort();
  }
  $scope.addWord = function() {
    if (!$scope.currWrd || $scope.currWrd == 'undefined') {
      $scope.currWrd = $scope.fullWords[Math.floor(Math.random() * $scope.fullWords.length)]
    }
    if ($scope.fullOut[$scope.fullOut.length - 2] == '.' || !$scope.fullOut[$scope.fullOut.length - 2]) {
      $scope.fullOut += ' ' + $scope.currWrd.cap() + ' ';
    } else {
      $scope.fullOut += $scope.currWrd + ' ';
    }

    $scope.remWrds--;
    if ($scope.remWrds) {
      var possWrds = Object.keys($scope.wordList[$scope.currWrd]),
        wfw = [];
      possWrds.forEach(function(wrd) {
        for (var j = 0; j < $scope.wordList[$scope.currWrd][wrd]; j++) {
          wfw.push(wrd);
        }
      });
      $scope.currWrd = wfw[Math.floor(Math.random() * wfw.length)];
      $scope.addWord();
    } else {
      if (!$scope.currWrd) {
        $scope.currWrd = $scope.fullWords[Math.floor(Math.random() * $scope.fullWords.length)]
      }
    }
  }
})
String.prototype.cap = function() {
  return this.slice(0, 1).toUpperCase() + this.slice(1);
}
