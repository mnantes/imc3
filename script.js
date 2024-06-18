document.addEventListener("DOMContentLoaded", function() {
    if (window.location.pathname.includes('resultado.html')) {
      mostrarResultado();
      document.getElementById('receitasBtn').addEventListener('click', function() {
        // Lógica para exibir receitas (a ser implementada)
        alert('Funcionalidade de receitas em desenvolvimento!');
      });
  
      // Carregar histórico do LocalStorage
      carregarHistoricoIMC();
    } else if (window.location.pathname.includes('index.html')) {
      document.querySelector("button").onclick = calcularIMC;
  
      // Carregar histórico do LocalStorage
      carregarHistoricoIMC();
    }
  });
  
  function calcularIMC() {
    var altura = parseFloat(document.getElementById('altura').value);
    var peso = parseFloat(document.getElementById('peso').value);
    var idade = parseInt(document.getElementById('idade').value);
  
    if (altura > 0 && peso > 0 && idade > 0) {
      var imc = peso / (altura * altura);
  
      // Salvar dados no LocalStorage
      salvarHistoricoIMC(altura, peso, idade, imc);
  
      sessionStorage.setItem('IMC', imc.toFixed(2));
      sessionStorage.setItem('Idade', idade);
      window.location.href = 'resultado.html';
    } else {
      alert('Por favor, preencha todos os campos corretamente.');
    }
  }
  
  function mostrarResultado() {
    var imc = parseFloat(sessionStorage.getItem('IMC'));
    var idade = parseInt(sessionStorage.getItem('Idade'));
  
    var ctx = document.getElementById('imcChart').getContext('2d');
  
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Seu IMC'],
        datasets: [{
          label: 'IMC',
          data: [imc],
          backgroundColor: ['rgba(54, 162, 235, 0.6)'],
          borderColor: ['rgba(54, 162, 235, 1)'],
          borderWidth: 1
        }, {
          label: 'IMC Ideal',
          data: [22],
          backgroundColor: ['rgba(75, 192, 192, 0.6)'],
          borderColor: ['rgba(75, 192, 192, 1)'],
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  
    var resultDiv = document.getElementById('imcResult');
    resultDiv.innerHTML = `<h2>Seu IMC é ${imc.toFixed(2)}</h2>`;
  
    carregarRecomendacoesPersonalizadas(imc, idade);
  }
  
  function carregarRecomendacoesPersonalizadas(imc, idade) {
    const faixaEtaria = obterFaixaEtaria(idade);
    const faixaIMC = obterFaixaIMC(imc);
  
    let recomendacao = "";
    let link = "";
  
    if (faixaIMC === "abaixo") {
      recomendacao = "Seu IMC indica que você está abaixo do peso ideal para sua idade e altura. É importante consultar um nutricionista para avaliar sua dieta e receber orientações personalizadas. Uma alimentação equilibrada, rica em nutrientes e calorias, pode ajudar a alcançar um peso saudável. Lembre-se de que o acompanhamento profissional é fundamental para garantir sua saúde e bem-estar. Além disso, a prática regular de exercícios físicos pode contribuir para o ganho de massa muscular e melhorar sua saúde geral.";
      link = "<a href='https://www.tuasaude.com/dieta-para-engordar/'>Saiba mais sobre como ganhar peso de forma saudável</a>";
    } else if (faixaIMC === "normal") {
      recomendacao = "Parabéns! Seu IMC está dentro da faixa considerada saudável para sua idade e altura. Continue mantendo hábitos alimentares equilibrados, com foco em alimentos nutritivos e porções adequadas. A prática regular de atividades físicas também é essencial para manter sua saúde e bem-estar a longo prazo. Lembre-se de que cada pessoa é única, e o acompanhamento médico regular é importante para garantir que você esteja em sua melhor forma.";
      link = "<a href='https://www.tuasaude.com/alimentos-saudaveis/'>Saiba mais sobre alimentos saudáveis para manter seu peso</a>";
    } else if (faixaIMC === "sobrepeso" || faixaIMC === "obesidade") {
      recomendacao = "Seu IMC indica que você está acima do peso ideal para sua idade e altura. É fundamental adotar um estilo de vida mais saudável, com foco em uma alimentação equilibrada e na prática regular de atividades físicas. Consulte um nutricionista para receber um plano alimentar personalizado e um profissional de educação física para orientação sobre exercícios adequados. Pequenas mudanças em seus hábitos podem fazer uma grande diferença para sua saúde a longo prazo. Lembre-se de que o acompanhamento médico regular é essencial para monitorar sua saúde e receber o suporte necessário.";
      link = "<a href='https://www.tuasaude.com/como-emagrecer/'>Saiba mais sobre como perder peso de forma saudável</a>";
    }
  
    document.getElementById('recommendation').innerHTML = `<p>${recomendacao}</p><p>${link}</p>`;
  }
  
  function obterFaixaEtaria(idade) {
    if (idade < 18) {
      return "jovem";
    } else if (idade >= 18 && idade <= 64) {
      return "adulto";
    } else {
      return "idoso";
    }
  }
  
  function obterFaixaIMC(imc) {
    if (imc < 18.5) {
      return "abaixo";
    } else if (imc >= 18.5 && imc <= 24.9) {
      return "normal";
    } else if (imc >= 25 && imc <= 29.9) {
      return "sobrepeso";
    } else {
      return "obesidade";
    }
  }
  
  function salvarHistoricoIMC(altura, peso, idade, imc) {
    var historico = JSON.parse(localStorage.getItem('historicoIMC')) || [];
    historico.push({ altura, peso, idade, imc });
    localStorage.setItem('historicoIMC', JSON.stringify(historico));
  }
  
  function carregarHistoricoIMC() {
    var historico = JSON.parse(localStorage.getItem('historicoIMC')) || [];
    var historicoDiv = document.getElementById('historicoIMC'); 
    historicoDiv.innerHTML = ''; 
  
    if (historico.length > 0) {
      historicoDiv.innerHTML += '<h3>Histórico de Cálculos:</h3>';
      historicoDiv.innerHTML += '<ul>';
      historico.forEach(function(item) {
        historicoDiv.innerHTML += `<li>Altura: ${item.altura}m, Peso: ${item.peso}kg, Idade: ${item.idade}, IMC: ${item.imc.toFixed(2)}</li>`;
      });
      historicoDiv.innerHTML += '</ul>';
    }
  }
  