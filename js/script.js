let jogadorY;
let computadorY;
let bolaX, bolaY;
let velocidadeBolaX, velocidadeBolaY;
let fundoImagem, bolaImagem, barra1Imagem, barra2Imagem;
let anguloBola = 0;
const espessuraBorda = 5;
let golMarcado = false;
let bounceSound, gameOverSound;
let pontosJogador = 0;
let pontosComputador = 0;

function preload() {
    // Carrega as imagens
    fundoImagem = loadImage('assets/fundo2.png');
    bolaImagem = loadImage('assets/sprites/bola.png');
    barra1Imagem = loadImage('assets/sprites/barra01.png');
    barra2Imagem = loadImage('assets/sprites/barra02.png');
    // Carrega o som de rebotee de gol
    bounceSound = loadSound('assets/bounce.wav');
    gameOverSound = loadSound('assets/game_over_mono.wav');
}

function setup() {
    createCanvas(800, 400);

    // Inicialização das posições
    jogadorY = height / 2;
    computadorY = height / 2;
    bolaX = width / 2;
    bolaY = height / 2;
    velocidadeBolaX = random([-3, 3]);
    velocidadeBolaY = random([-3, 3]);
}

function draw() {
    background(0);

    // Desenha a imagem de fundo e ajusta o corte
    let larguraImagem = fundoImagem.width;
    let alturaImagem = fundoImagem.height;
    let yOffset = (alturaImagem - height) / 2;

    image(fundoImagem, 0, 0, width, height, 0, yOffset, larguraImagem, alturaImagem - yOffset * 2);

    // Exibe as raquetes e a bola com as imagens escaladas
    image(barra1Imagem, 50, jogadorY - 40, 10, 80);
    image(barra2Imagem, width - 60, computadorY - 40, 10, 80);

    // Rotação da bola
    anguloBola += velocidadeBolaX * 0.05;

    push();
    translate(bolaX, bolaY);
    rotate(anguloBola);
    image(bolaImagem, -10, -10, 20, 20);
    pop();

    // Bordas superior e inferior
    fill('#14203C');
    rect(0, 0, width, espessuraBorda);
    rect(0, height - espessuraBorda, width, espessuraBorda);

    // Movimento da bola
    bolaX += velocidadeBolaX;
    bolaY += velocidadeBolaY;

    // Rebater nas barras superior e inferior
    if (bolaY <= espessuraBorda + 10 || bolaY >= height - espessuraBorda - 10) {
        velocidadeBolaY *= -1;
    }

    // Funções auxiliares
    function aumentarVelocidade() {
        const fatorAumento = 1.1;
        velocidadeBolaX *= fatorAumento;
        velocidadeBolaY *= fatorAumento;
    }

    function efeitoRaquete(raqueteY) {
        const pontoImpacto = bolaY - raqueteY;
        const fatorAngulo = 0.15;
        velocidadeBolaY = pontoImpacto * fatorAngulo;
    }

    // Movimento da raquete do computador
    if (bolaX > width / 2) {
        let velocidadeComputador = 3;
        if (bolaY > computadorY) {
            computadorY += velocidadeComputador + random(-1, 1);
        } else {
            computadorY -= velocidadeComputador + random(-1, 1);
        }
        computadorY = constrain(computadorY, 40, height - 40);
    }

    // Verificar se o gol foi marcado ao passar da linha da raquete
    if (bolaX < 50 || bolaX > width - 50) {
        if (!golMarcado) { // Verifica se o gol não foi marcado ainda
            golMarcado = true;
            if (bolaX < 50) {
                pontosComputador++; // Gol do computador
            } else if (bolaX > width - 50) {
                pontosJogador++; // Gol do jogador
            }
            if (gameOverSound && !gameOverSound.isPlaying()) {
                gameOverSound.play();
            }

            // Narra o placar
            narrarPlacar();
        }
    }

    // Reiniciar a bola ao atingir a borda lateral, após marcar o gol
    if (golMarcado && (bolaX < 0 || bolaX > width)) {
        bolaX = width / 2;
        bolaY = height / 2;
        velocidadeBolaX = random([-3, 3]);
        velocidadeBolaY = random([-3, 3]);
        golMarcado = false; // Reseta a marcação do gol
    }

    // Colisões com as raquetes (apenas se o gol não tiver sido marcado)
    if (!golMarcado) {
        // Colisão com a raquete do jogador
        if (bolaX <= 70 && bolaY >= jogadorY - 40 && bolaY <= jogadorY + 40 && velocidadeBolaX < 0) {
            bolaX = 70;
            velocidadeBolaX *= -1;
            efeitoRaquete(jogadorY);
            aumentarVelocidade();
            if (bounceSound && !bounceSound.isPlaying()) {
                bounceSound.play();
            }
        }

        // Colisão com a raquete do computador
        if (bolaX >= width - 70 && bolaY >= computadorY - 40 && bolaY <= computadorY + 40 && velocidadeBolaX > 0) {
            bolaX = width - 70;
            velocidadeBolaX *= -1;
            efeitoRaquete(computadorY);
            aumentarVelocidade();
            if (bounceSound && !bounceSound.isPlaying()) {
                bounceSound.play();
            }
        }
    }

    // Controlar a raquete do jogador com o mouse
    jogadorY = constrain(mouseY, espessuraBorda + 40, height - espessuraBorda - 40);

    // Exibir o placar
    textSize(32);
    fill(255);
    textAlign(CENTER, TOP);
    text(`Jogador: ${pontosJogador}`, width / 4, 20);
    text(`Computador: ${pontosComputador}`, width * 3 / 4, 20);
}

// Função para narrar o placar
function narrarPlacar() {
    const msg = new SpeechSynthesisUtterance(`Placar: Jogador ${pontosJogador} a ${pontosComputador} Computador`);
    msg.lang = 'pt-BR'; // Definir o idioma como português
    speechSynthesis.speak(msg); // Fala o placar
}

