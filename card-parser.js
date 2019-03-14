function CardStat(card) {
  this.owner = (card.members[0] || {username: 'nobody'}).username;
  this.sprintEstimate = parseInt((/__Sprint estimate__:\s*(\d+)/i.exec(card.desc) || [null, 0])[1]);
  this.sprintSpent = parseInt((/__Sprint spent__:\s*(\d+)/i.exec(card.desc) || [null, 0])[1]);
  this.qaOwner = (/__QA__:\s*@(\w+)/i.exec(card.desc) || [null, 'nobody'])[1];
  this.qaEstimate = parseInt((/__QA estimate__:\s*(\d+)/i.exec(card.desc) || [null, 0])[1]);
  this.qaSpent = parseInt((/__QA spent__:\s*(\d+)/i.exec(card.desc) || [null, 0])[1]);
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
  },
  actualDev: function() {
    return this.devCards.reduce((total, card) => total + card.sprintSpent, 0);
  },
  actualQA: function() {
    return this.qaCards.reduce((total, card) => total + card.qaSpent, 0);
  },
  actualWork: function() {
    return this.actualDev() + this.actualQA()
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
