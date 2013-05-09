var myKnowiiApp = angular.module('myKnowiiApp',[]);
myKnowiiApp.factory('Data',function() {
	return {message:"Coco"}
})

myKnowiiApp.directive("knowli", function() {
	return  {
		restrict:"E",
		template:"<div>this is the knowli directive</div>"
	}
})

myKnowiiApp.factory('Knowiis',function() {
	var knowiisToRet = {} ;

	knowiisToRet.knowiis = [{
	"Raiting" : 3,
	"Date" : "23/01/2012",
	"PublisherName" : "אורי דודי",
	"Image-src" : "img/preview.jpg",
	"Previewtxt" : "Craftsy Workshops are tutorials from amazing designers that include the pattern, instructions, and step-by-step photos. And, the BEST part: you'll never get stuck...just ask the pattern designer for help!"
},
{
	"Raiting" : 1,
	"Date" : "21/01/2012",
	"PublisherName" : "Coco Loco",
	"Image-src" : "img/preview.jpg",
	"Previewtxt" : "Published on Feb 22, 2013 - Visit http://egghead.io to comment, browse source, and other features"
}];

	return knowiisToRet;
})

myKnowiiApp.filter('range', function() {
  return function(input, total) {
    total = parseInt(total);
    for (var i=0; i<total; i++)
      input.push(i);
    return input;
  };
});


function SmallKnowiiCtrl($scope,Knowiis) {
	$scope.knowiis = Knowiis.knowiis;

  	$scope.cost = 19.95;
} 