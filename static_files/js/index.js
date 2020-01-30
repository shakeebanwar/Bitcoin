 
var graph = (function(){
  var urgentTitle = "Urgent",
      $graph = $('.graph'),
      $barContainer = $graph.find('.graph-bars'),
      $markers = $('.markers'),
      $graphTitles = $('.graph-titles'),
      max = null,
      limit = null;
  var init = function(data){ 
    max = getMaxValue(data);
    limit = max + Math.ceil(max * 0.05);
    $barContainer.empty();
    $markers.empty();
    $graphTitles.empty();
    $('#urgent-title').text(urgentTitle);
 
    setMarkers($markers, limit);
    if (data.length) buildTeamRows($barContainer, $graphTitles, data, limit);
    else buildUserRows($barContainer, $graphTitles, data, limit);
  };
 
  // return a values percentage in relation to the limit
  var getPercentage = function(value, limit) {
      return value / limit * 100 + "%";
  };
  
  var getMaxValue = function(data) {
    var largest = 0;
    var sum = 0;
    if (data.length) {
      for (x=0;x<data.length;x++) {
        sum = data[x].active + data[x].newCount + data[x].newFromBatch;
        if (sum > largest) {
          largest = sum;
        }
      }
    } else {
      largest = Math.max(data.active, data.newCount, data.newFromBatch);
    }
    return largest;
  };
 
  var setMarkers = function($selector, limit) {
    var increment = limit / 5;
    var value = 0;
    var values = [];
    var leftOffset = 0;
    // Create array of marker values
    while(value < limit) {
      values.push(Math.round(value));
      value += increment;
    }
    values.push(limit);
    for (var x=0;x<values.length;x++) {
      var $markerTmpl = $('<div class="marker"><span class="marker-number"></span></div>');
      leftOffset = getPercentage(values[x], limit);
      $markerTmpl.css({ 'left': leftOffset }).find('.marker-number').text(values[x]);
      $selector.append($markerTmpl);
    }
    $selector.addClass('loaded');
  };
 
  //Build each individual graph based on selector, data, and max value
  var buildTeamRows = function($barSelector, $titleSelector, data, limit) {
    var percentage;
    // Loop through data
    for (var x=0;x<data.length;x++) {
      var titleClass = null;
      var titleCount = 0;
      var $graphBar = $('<div class="graph-bar"></div>')
          .attr('id', 'userGraph-' + data[x].userId);
      $barSelector.append($graphBar);
      // Render each fragment
      renderFragment($graphBar, 'urgent', data[x].urgent, limit);
      renderFragment($graphBar, 'active', data[x].active - data[x].urgent, limit);
      renderFragment($graphBar, 'newCount', data[x].newCount, limit);
      renderFragment($graphBar, 'newFromBatch', data[x].newFromBatch, limit);
 
      // Calculate largest fragment value
      var largest = 0;
      $.each(data[x], function(index, value){
        if ($.isNumeric(value)){
          if (value > largest) {
            largest = value;
            titleClass = index;
            titleCount = value;
          }
        }
      });
      // If Active is greatest value, Check if urgent portion of active is greater than active
      if (titleClass === 'active' && data[x].urgent >= (data[x].active - data[x].urgent)) {
        titleClass = 'urgent';
        titleCount = data[x].urgent;
      }
    // Render row meta-data
    var $titleSet = $('<div class="graph-title"><div class="graph-title-name"></div><div class="graph-title-count"></div></div>');
    $titleSet.find('.graph-title-name').text(data[x].userName);
    $titleSet.find('.graph-title-count').addClass(titleClass).text(titleCount);
    $titleSelector.append($titleSet);
    }
  };
 
  var renderFragment = function($selector, type, value, limit) {
    var $rowFragmentTmpl = $('<div class="graph-bar-fragment"></div>');
    var percentage = getPercentage(value, limit);
    $rowFragmentTmpl.attr('data-value', value);
    $selector.append($rowFragmentTmpl.addClass(type));
    setTimeout(function(){
      $rowFragmentTmpl.css({'width': percentage});
    }, 1);
  };
 
  var buildUserRows = function($barSelector, $titleSelector, data, limit) {
    renderUserRow($barSelector, $titleSelector, 'urgent', data.urgent, limit, urgentTitle);
    renderUserRow($barSelector, $titleSelector, 'active', data.active, limit, 'Active');
    renderUserRow($barSelector, $titleSelector, 'newCount', data.newCount, limit, 'New');
    renderUserRow($barSelector, $titleSelector, 'newFromBatch', data.newFromBatch, limit, 'New From Batch');
  };
 
  var renderUserRow = function($barSelector, $titleSelector, type, value, limit, title) {
    var percentage = getPercentage(value, limit);
    var $graphBar = $('<div class="graph-bar graph-bar-single"></div>').attr({'id' : 'userGraph-' + type, 'data-value': value});
    $barSelector.append($graphBar);
    setTimeout(function(){
      $graphBar.css({'width': percentage}).addClass(type);
    },1);
 
    var $titleSet = $('<div class="graph-title"><div class="graph-title-name"></div><div class="graph-title-count"></div></div>');
    $titleSet.find('.graph-title-name').text(title);
    $titleSet.find('.graph-title-count').addClass(type).text(value);
    $titleSelector.append($titleSet);
  };
 
  return {
    init: init
  }
 
})();


// Document ready

$(function(){
   // Dummy Data
  var dataSet = [
    {
      active: 5,
      newCount: 4,
      newFromBatch: 14,
      urgent: 1,
      userId: "User4",
      userName: "User4"
    },
    {
      active: 21,
      newCount: 2,
      newFromBatch: 5,
      urgent: 10,
      userId: "User3",
      userName: "User3"
    },  
    {
      active: 25,
      newCount: 4,
      newFromBatch: 3,
      urgent: 20,
      userId: "User2",
      userName: "User2"
    },  
    {
      active: 10,
      newCount: 24,
      newFromBatch: 4,
      urgent: 2,
      userId: "User1",
      userName: "User1"
    },  
  ];
 
  var dataSingle = {
      active: 25,
      newCount: 4,
      newFromBatch: 3,
      urgent: 20,
      userId: "ryan",
      userName: "Ryan Scofield"
  };
 
  // Initialize Graph
  graph.init(dataSet);
 
  $('#teamGraph').on('click', function(e){
    graph.init(dataSet);
  });
 
  $('#userGraph').on('click', function(e){
    graph.init(dataSingle);
  });
});