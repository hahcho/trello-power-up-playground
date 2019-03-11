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
        {title: 'Sprint', text: `🏃 ${stat.sprintSpent}/${stat.sprintEstimate}`},
        {title: 'QA', text: `@${stat.qaOwner} 🔎 ${stat.qaSpent}/${stat.qaEstimate}`}
      ];
    });
  }
});
