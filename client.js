var Promise = TrelloPowerUp.Promise;

var CARD_TEMPLATE = `
# What

_Describe in detail what is the goal of the task and what we want to achieve._

- Feature flags
- Analytics
- Tooltips

# Why

_Describe why are we doing this task. What problem are we solving to our customers or business._

# Design

_List all links to the finished design._

# Engineering

__PR__: _Link to the GitHub pull request after the task has been implemented_

__Sprint estimate__: _Estimate how long the task will take to be completed_
__Sprint spent__: _Total hours spent on the task_

__QA__: _The person responsible for doing QA_
__QA Estimate__: _Total hours estimated for QA_
__QA Spent__: _Total hours spent in QA_

__Total estimate__: _Total hours estimate_
__Total Spent__: _Total hours spent_
`;

var ADHOC_CARD_TEMPLATE = `
# What

# Why

# Engineering

__PR__: _Link to the GitHub pull request after the task has been implemented_

__Sprint spent__: _Total hours spent on the task_

__QA Spent__: _Total hours spent in QA_

__Total Spent__: _Total hours spent_
`;

function createCard(template, listId) {
  Trello.post('/cards/', {
    name: 'New card',
    desc: template,
    idList: listId,
    pos: 'top'
  });
}

function addNewTask(t, template) {
  t.lists('id', 'name').then(function(lists) {
    var list = lists.find(list => {
      return list.name === 'Ready For Development' 
    });

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
  })
}

TrelloPowerUp.initialize({
  'board-buttons': function(t, options){
    return [
      {
        text: 'Add New Task',
        callback: function(t){
          t.popup({
            title: 'Add New Task',
            items: [
              {text: 'Add New Task', callback: (t) => addNewTask(t, CARD_TEMPLATE)},
              {text: 'Add New AdHoc Task', callback: (t) => addNewTask(t, ADHOC_CARD_TEMPLATE)},
            ]
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
