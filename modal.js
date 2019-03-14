var t = TrelloPowerUp.iframe();

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
          <td>${member.actualDev()}</td>
          <td>${member.estimatedQA()}</td>
          <td>${member.actualQA()}</td>
          <td>${member.estimatedWork()}</td>
          <td>${member.actualWork()}</td>
        </tr>
      `
    }).join('');
  });
});
