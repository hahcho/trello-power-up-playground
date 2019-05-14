var Promise = TrelloPowerUp.Promise;

var CARD_TEMPLATE = `
# What

# Why

# Design

# Engineering

__PR__: 

__Sprint estimate__: 
__Sprint spent__: 

__QA__: 
__QA Estimate__: 
__QA Spent__: 

__Total estimate__: 
__Total Spent__: 
`;

var ADHOC_CARD_TEMPLATE = `
# What

# Why

# Engineering

__PR__: 
__Sprint spent__: 

__QA Spent__: 

__Total Spent__: 
`;

function createCard(template, listId) {
  Trello.post('/cards/', {
    name: 'New card',
    desc: template,
    idList: listId,
    pos: 'top'
  });
}

function addNewTask(list, template) {
  if (Trello.authorized()) {
    return createCard(template, list.id);
  }

  Trello.authorize({
    type: 'popup',
    name: 'Authorize Power Up to Add Cards',
    scope: {read: true, write: true},
    success: () => createCard(template, list.id),
    error: console.log
  });
}

TrelloPowerUp.initialize({
  'board-buttons': function(t, options){
    return [{
      text: 'Summary',
      callback: function(t){
        return t.modal({
          url: './modal.html',
          height: 500,
          title: 'Sprint summary',
        })
      }
    }];
  },
  'list-actions': function(t) {
      return t.list('name', 'id').then(function(list) {
        return [
          {text: 'Add New Task', callback: () => addNewTask(list, CARD_TEMPLATE)},
          {text: 'Add New AdHoc Task', callback: () => addNewTask(list, ADHOC_CARD_TEMPLATE)}
        ]
      });
  },
  'card-badges': function(t, options){
    return t.card('name', 'desc', 'members', 'labels').then(function(card) {
      var stat = new CardStat(card);

      return [
        {title: 'Sprint', text: `🏃 ${stat.sprintSpent}/${stat.sprintEstimate}`},
        {title: 'QA', text: `@${stat.qaOwner} 🔎 ${stat.qaSpent}/${stat.qaEstimate}`}
      ];
    });
  }
});
