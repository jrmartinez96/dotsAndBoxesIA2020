export const problemaTotitoChino = {
    isGoal: (estado, iteracion) => {
        return iteracion === 3;
    },



    movimientos: (estado) => {
        const horizontal = estado['h'];
        const vertical = estado['v'];
        let possibleMoves = [];

        // horizontal
        horizontal.forEach((espacio, i) => {
            if (espacio === 99) {
                possibleMoves.push([0, i])
            }
        });

        // vertical
        vertical.forEach((espacio, i) => {
            if (espacio === 99) {
                possibleMoves.push([1, i]);
            }
        })

        return shuffle(possibleMoves);
    },



    resultado: (estado, movimiento, playerId) => {
        let board = [estado['h'], estado['v']];
        const N = 6 - (6% 2)
        
        // Fill space in board 
        let punteoAntesTurno = 0;
        let punteoTurno = 0;

        // Reiniciar contadores a 0
        let acumulador = 0;
        let contador = 0;
  
        for(let i = 0; i < board[0].length; i++){
            if(((i + 1) % N) !== 0){
                if(board[0][i] !== 99 && board[0][i + 1] !== 99 && board[1][contador + acumulador] !== 99 && board[1][contador + acumulador + 1] !== 99){
                    punteoAntesTurno = punteoAntesTurno + 1;
                }
                acumulador = acumulador + N;
            }
            else{
                contador = contador + 1;
                acumulador = 0;
            }
        }

        board[movimiento[0]][movimiento[1]] = 0;

        // Reiniciar contadores a 0
        acumulador = 0;
        contador = 0;

        for(let i = 0; i < board[0].length; i++){
            if(((i + 1) % N) !== 0){
                if(board[0][i] !== 99 && board[0][i + 1] !== 99 && board[1][contador + acumulador] !== 99 && board[1][contador + acumulador + 1] !== 99){
                punteoTurno = punteoTurno + 1;
                }
                acumulador = acumulador + N;
            }
            else{
                contador = contador + 1;
                acumulador = 0;
            }
        }

        if(punteoAntesTurno < punteoTurno){
            if(playerId === 1){
                if((punteoTurno - punteoAntesTurno) === 2){
                    board[movimiento[0]][movimiento[1]] = 2;
                }
                else if((punteoTurno - punteoAntesTurno) === 1){
                    board[movimiento[0]][movimiento[1]] = 1;
                }
            }
            else if(playerId === 2){
                if((punteoTurno - punteoAntesTurno) === 2){
                    board[movimiento[0]][movimiento[1]] = -2;
                }
                else if((punteoTurno - punteoAntesTurno) === 1){
                    board[movimiento[0]][movimiento[1]] = -1;
                }
            }
        }

        return {h: board[0], v: board[1]}
    },



    utility: (estado, playerId) => {
        let punteo1 = 0;
        let punteo2 = 0;
        let utilidad = 0;

        estado['h'].forEach(linea => {
            if (linea > 0 && linea < 99) {
                punteo1 = punteo1 + linea
            }
            if (linea < 0) {
                punteo2 = punteo2 + linea
            }
        })
        estado['v'].forEach(linea => {
            if (linea > 0 && linea < 99) {
                punteo1 = punteo1 + Math.abs(linea);
            }
            if (linea < 0) {
                punteo2 = punteo2 + Math.abs(linea);
            }
        })

        if (playerId === 1) {
            utilidad = punteo1 - punteo2;
        } else if (playerId === 2) {
            utilidad = punteo2 - punteo1
        }

        return utilidad;
    }
}

export const alphaBeta = (problema, board, myPlayerId) => {
    const inicial = board;
    const { accion } = valorMax(problema, inicial, -100, 100, 0, myPlayerId);

    return accion
}

export const valorMax = (problema, estado, alfa, beta, iteracion, myPlayerId) => {
    let alfav = alfa;
    if(problema.isGoal(estado, iteracion)) {
        return {accion: null, valor: problema.utility(estado, myPlayerId)}
    }

    let mayorValor = -100;
    let mejorAccion = null;

    problema.movimientos(estado).forEach(movimiento => {
        const resultado = problema.resultado(estado, movimiento, myPlayerId);
        const utilidad = valorMin(problema, resultado, alfav, beta, iteracion + 1, myPlayerId === 1 ? 2 : 1);

        if(utilidad.valor > mayorValor) {
            mayorValor = utilidad.valor;
            mejorAccion = movimiento;
        }
        if(mayorValor >= beta) {
            return { accion: mejorAccion, valor: mayorValor }
        }
        if(mayorValor > alfav) {
            alfav = mayorValor
        }
    });

    return { accion: mejorAccion, valor: mayorValor }
}

export const valorMin = (problema, estado, alfa, beta, iteracion, otherPlayerId) => {
    let betav = beta;
    if(problema.isGoal(estado, iteracion)) {
        return {accion: null, valor: problema.utility(estado, otherPlayerId === 1 ? 2 : 1)}
    }
    
    let menorValor = 100;
    let mejorAccion = null;

    problema.movimientos(estado).forEach(movimiento => {
        const resultado = problema.resultado(estado, movimiento, otherPlayerId);
        const utilidad = valorMax(problema, resultado, alfa, betav, iteracion + 1, otherPlayerId === 1 ? 2 : 1);
        if(utilidad.valor < menorValor) {
            menorValor = utilidad.valor;
            mejorAccion = movimiento;
        }
        if(menorValor <= alfa) {
            return {accion: mejorAccion, valor: menorValor}
        }
        if(menorValor > betav) {
            betav = menorValor;
        }
    })
    return { accion: mejorAccion, valor: menorValor }
}

const shuffle = (arr) => {
    let array = [...arr]
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }

    return array;
}
