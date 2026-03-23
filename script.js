const visor = document.querySelector('.visor');
const botoes = document.querySelectorAll('.btn');
let expressao = '';
let mutado = false;
const audioCtx = new AudioContext();
document.addEventListener('click', function() {
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
}, { once: true });
const imgMute = document.querySelector('#imgMute');
window.addEventListener('load', function() {
  document.body.focus();
});

function tocarClique() {
    if (mutado) return;
  const oscilador = audioCtx.createOscillator();
  const ganho = audioCtx.createGain();

  oscilador.connect(ganho);
  ganho.connect(audioCtx.destination);

  oscilador.type = 'square';
  oscilador.frequency.setValueAtTime(1200, audioCtx.currentTime);
  oscilador.frequency.exponentialRampToValueAtTime(20, audioCtx.currentTime + 0.05);

  ganho.gain.setValueAtTime(0.3, audioCtx.currentTime);
  ganho.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.05);

  oscilador.start(audioCtx.currentTime);
  oscilador.stop(audioCtx.currentTime + 0.05);
}

botoes.forEach(function(botao) {
    botao.addEventListener('click', function() {
        tocarClique();
        const valor = botao.dataset.valor || botao.textContent;
        if (valor === 'C') {
            expressao = '';
            visor.textContent = ' ';
            ajustarFonte();
        } else if (valor === '=') {
            let calculo = expressao.replace(/x/g, '*').replace(/÷/g, '/');
            let resultado = eval(calculo);
            if (isNaN(resultado) || resultado === undefined) {
                visor.textContent = 'Erro';
                expressao = '';
            } else {
            expressao = String(resultado);
            visor.textContent = expressao;
            ajustarFonte();
            }
            } else if (valor === '±') {  
                if (expressao === '') return;
                expressao = String(parseFloat(expressao) * -1);
                visor.textContent = expressao;
                ajustarFonte();
            } else if (valor === '%') {
                expressao = String(parseFloat(expressao) / 100);
                visor.textContent = expressao;
                ajustarFonte();
        } else {
            const operadores = ['+', '-', 'x', '÷'];
            if (operadores.includes(valor) && expressao === '') {
                return;
            }
            expressao += valor;
            visor.textContent = expressao;
            ajustarFonte();
        } 
    });
});

function ajustarFonte() {
    const tamanho = expressao.length;
    if (tamanho > 12) {
        visor.style.fontSize = '20px';
    } else if (tamanho > 8) {
        visor.style.fontSize = '24px';
    } else {
        visor.style.fontSize = '32px';
    }
}

document.addEventListener('keydown', function(evento) {
    const tecla = evento.key;
    tocarClique();
    const teclasValidas = ['0','1','2','3','4','5','6','7','8','9','+','-','x','/','.',','];
    if (teclasValidas.includes(tecla)) {
        expressao += tecla === ',' ? '.' : tecla;
        visor.textContent = expressao;
        ajustarFonte();
    } else if (tecla === 'Enter') {
        let calculo = expressao.replace(/x/g, '*');
        let resultado = eval(calculo);
        expressao = String(resultado);
        visor.textContent = expressao;
        ajustarFonte();
    } else if (tecla === 'Backspace') {
        expressao = expressao.slice(0, -1);
        visor.textContent = expressao || '';
        ajustarFonte();
    } else if (tecla === 'Escape') {
        expressao = '';
        visor.textContent = '';
        visor.style.fontSize = '36px';
    }
});

btnMute.addEventListener('click', function() {
    mutado = !mutado;
    imgMute.src = mutado ? 'mudo.svg' : 'som.svg';
});