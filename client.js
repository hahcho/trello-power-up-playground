var Promise = TrelloPowerUp.Promise;

TrelloPowerUp.initialize({
  'board-buttons': function(t, options){
    return [
      {
        text: 'Add New Task',
        callback: function(t){
          Trello.authorize({
            type: 'popup',
            name: 'Authorize Power Up to Add Cards',
            scope: {read: true, write: true},
            success: console.log,
            error: console.log
          });
        }
      },
      {
        text: 'Summary',
        callback: function(t){
          return t.modal({
            url: './modal.html',
            height: 500,
            title: 'Sprint summary',
          })
        }
      }
    ];
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
