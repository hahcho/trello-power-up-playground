var Promise = TrelloPowerUp.Promise;

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
    return t.card('name', 'desc', 'members').then(function(card) {
      var stat = new CardStat(card);

      return [
        {title: 'Sprint estimate', text: `Sprint estimate: ${stat.sprintEstimate}h`},
        {title: 'Sprint spent', text: `Sprint spent: ${stat.sprintEstimate}h`},
        {title: 'QA', text: `QA: ${stat.qaOwner}`},
        {title: 'QA estimate', text: `QA: ${stat.qaEstimate}`},
        {title: 'QA spent', text: `QA spent: ${stat.qaSpent}`},
      ];
    });
  }
});
