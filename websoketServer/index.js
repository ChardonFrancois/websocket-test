//initialisation websocket

const webSocketsServerPort = 8000
const webSocketServer = require('websocket').server
const http = require('http')

// fillage du http server et du websocket sevrer

const server = http.createServer()
server.listen(webSocketsServerPort)
console.log('listening on server 8000')

const wsServer = new webSocketServer({
  httpServer: server,
})

const clients = {}

// code qui genere un id unique
const getUniqueId = () => {
  const s4 = () =>
    Math.floor((1 + Math.random()) * 0x1000)
      .toString(16)
      .substring(1)
  return s4() + s4() + '_' + s4()
}

// '' ON ''  = ajouter
// on  cree un utilisateur et on lui donne l id cree avec la fonction
wsServer.on('request', function (request) {
  const userId = getUniqueId()
  console.log(
    new Date() + 'Recevied a new connection from origin' + request.origin + '.'
  )

  // accepte  que les requêtes dont l'origine est autorisée.

  const connection = request.accept(null, request.origin)
  clients[userId] = connection
  console.log(
    'connecter: ' + userId + 'in' + Object.getOwnPropertyNames(clients)
  )
  connection.on('message', function (message) {
    if (message.type === 'utf8') {
      console.log('Received Message:  ', message.utf8Data)

      // Diffusion du message à tous les clients connectés

      for (key in clients) {
        clients[key].sendUTF(message.utf8Data)
        console.log('sent Message to: ', clients[key])
      }
    }
  })
})
