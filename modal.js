/* global TrelloPowerUp */

var t = TrelloPowerUp.iframe();

function CardStat(card) {
  this.owner = (card.members[0] || {username: 'nobody'}).username;
  this.qaOwner = (/__QA__:\s*@(\w+)/.exec(card.desc) || [null, 'nobody'])[1];
  this.sprintEstimate = parseInt((/__Sprint estimate__:\s*(\d+)/.exec(card.desc) || [null, 0])[1]);
  this.qaEstimate = parseInt((/__QA estimate__:\s*(\d+)/.exec(card.desc) || [null, 0])[1]);
}

function Member(name) {
  this.name = name;
  this.qaCards = [];
  this.devCards = [];
}

Member.prototype = {
  estimatedDev: function() {
    return this.devCards.reduce((total, card) => total + card.sprintEstimate, 0);
  },
  estimatedQA: function() {
    return this.qaCards.reduce((total, card) => total + card.qaEstimate, 0);
  },
  estimatedWork: function() {
    return this.estimatedDev() + this.estimatedQA();
  }
};

function CardsSummary(cards) {
  this.members = {};
  
  cards.forEach((card) => {
    this.members[card.owner] = this.members[card.owner] || new Member(card.owner);
    this.members[card.qaOwner] = this.members[card.qaOwner] || new Member(card.qaOwner);
    
    this.members[card.owner].devCards.push(card);
    this.members[card.qaOwner].qaCards.push(card);
  });
}

t.render(function(){
  t.cards('name', 'desc', 'members').then(function(cards) {
    var summary = new CardsSummary(cards.map((card) => new CardStat(card)));
    
    var table = document.getElementById('estimates');
    var tbody = table.querySelector('tbody');
    
    tbody.innerHTML = Object.values(summary.members).map(function(member) {
      return `
        <tr>
          <td>${member.name}</td>
          <td>${member.estimatedDev()}</td>
          <td>${member.estimatedQA()}</td>
          <td>${member.estimatedWork()}</td>
        </tr>
      `
    }).join();
  });
});
