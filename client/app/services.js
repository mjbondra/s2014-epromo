'use strict';

var app = angular.module('ePromo.services', []);

/*------------------------------------*\
    SITE-WIDE VALUES
\*------------------------------------*/

/*------------------------------------*\
    EXTERNAL LIBRARY SERVICES
\*------------------------------------*/

/**
 * Underscore Service
 */
app.factory('_', function () {
  return require('underscore');
});

/*------------------------------------*\
    GENERAL SERVICES
\*------------------------------------*/

/**
 * API Service
 */
app.factory('API', ['$http', function ($http) {
  return function (url, method) {
    url = '/api/' + url;
    method = method || 'GET';
    return $http({ method: method, url: url, params: { t: new Date().getTime() }});
  };
}]);

/**
 * Countdown Service
 */
app.factory('Countdown', ['$q', 'API', function ($q, API) {
  var addDays = function (date, days) {
    var newDate = new Date(date);
    newDate.setDate(date.getDate() + days);
    return newDate;
  };
  var max = -1;
  var min = -1;
  return {
    generate: function (countdownLength, startDate) {
      var deferred = $q.defer();
      var _index = [];
      var i = countdownLength;
      var releaseDate = new Date(startDate);
      while (i--) {
        _index.push({ releaseDate: releaseDate, countdownNumber: i + 1 });
        releaseDate = addDays(releaseDate, 7);
      }
      API('countdown').success(function (index) {
        var i = index.length;
        while (i--) if (index[i].countdownNumber) {
          var countdownNumber = parseInt(index[i].countdownNumber);
          _index[countdownLength - countdownNumber] = index[i];
          if (countdownNumber > max) max = countdownNumber;
          if (countdownNumber < min || min === -1) min = countdownNumber;
        }
        deferred.resolve(_index);
      }).error(function (err) {
        deferred.reject(_index);
      });
      return deferred.promise;
    },
    next: function (countdownNumber) {
      countdownNumber = parseInt(countdownNumber);
      if (max >= countdownNumber + 1) return countdownNumber + 1;
      return false;
    },
    previous: function (countdownNumber) {
      countdownNumber = parseInt(countdownNumber);
      if (min <= countdownNumber - 1) return countdownNumber - 1;
      return false;
    }
  };
}]);

/**
 * Date Handling Service
 */
app.factory('DateHandler', [function () {
  return {
    month: [
      { name: 'January', abbreviation: 'Jan' },
      { name: 'February', abbreviation: 'Feb' },
      { name: 'March', abbreviation: 'Mar' },
      { name: 'April', abbreviation: 'Apr' },
      { name: 'May', abbreviation: 'May' },
      { name: 'June', abbreviation: 'Jun' },
      { name: 'July', abbreviation: 'Jul' },
      { name: 'August', abbreviation: 'Aug' },
      { name: 'September', abbreviation: 'Sep' },
      { name: 'October', abbreviation: 'Oct' },
      { name: 'November', abbreviation: 'Nov' },
      { name: 'December', abbreviation: 'Dec' }
    ]
  };
}]);

/**
 * Factory for routes that do not point to a controller or template
 */
app.factory('NoView', ['Head', function (Head) {
  return function () {
    Head.setTitle('Countdown to Technology, Innovation, and Inspiration');
    Head.setDescription('Countdown to Technology, Innovation, and Inspiration');
  };
}]);

/*------------------------------------*\
    ELEMENTAL SERVICES
\*------------------------------------*/

/**
 * <head> Service
 */
app.factory('Head', ['$rootScope', function ($rootScope) {
  var title, description;
  $rootScope.getDescription = function () {
    return description;
  };
  $rootScope.getTitle = function () {
    return title;
  };
  return {
    setDescription: function (d) {
      description = d;
    },
    setTitle: function (t) {
      title = t + ' | SIGGRAPH 2014';
    }
  };
}]);

/**
 * <body> Service
 */
app.factory('Body', ['$rootScope', function ($rootScope) {}]);
