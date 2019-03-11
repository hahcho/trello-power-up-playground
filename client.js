var Promise = TrelloPowerUp.Promise;

var getBadges = function(t){
  return t.card('desc').get('desc').then(function(cardDesc) {
    var reg = reg = new RegExp('__Sprint spent__:\\s+(\\d+)h');
    var match = reg.exec(cardDesc) || [];
    var sprintSpent = match[1];
    
    return [{
      title: 'Sprint spent: ' + sprintSpent,
      text: 'Sprint spent: ' + sprintSpent
    }];
  });
};

// We need to call initialize to get all of our capability handles set up and registered with Trello
TrelloPowerUp.initialize({
  'board-buttons': function(t, options){
    return {
        text: 'Summary',
        callback: function(t){
          return t.modal({            
            url: './modal.html',
            height: 500,
            title: 'Sprint summary',
          })
        }
    };
  },
  'card-badges': function(t, options){
    return getBadges(t);
  }
});
