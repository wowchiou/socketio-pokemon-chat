// Setup basic express server
const express = require('express');
const app = express();
const socketio = require('socket.io');
const path = require('path');
// const port = process.env.PORT || 9000;
const port = 9000;

// Routing
app.use(express.static(path.join(__dirname, 'public')));

const io = socketio(
  app.listen(port, () => {
    console.log('Server listening at port %d', port);
  })
);

let history = [];

io.on('connection', socket => {
  const avatar = `https://pkq.herokuapp.com/static/Icon/${Math.floor(
    Math.random() * 151
  ) + 1}.png`;

  let username = null;

  let renderHistory = '';
  if (history.length !== 0) {
    history.forEach(msg => {
      renderHistory += buildMsgHtml(msg);
    });
  }

  socket.on('add user', name => {
    username = name;
    socket.emit('first come in room', {
      avatar,
      history: renderHistory
    });
    updateUserInRoom();
  });

  socket.on('message to server', msg => {
    const info = {
      username,
      avatar,
      message: msg,
      time: Date.now()
    };
    history.push(info);
    io.emit('message to client', buildMsgHtml(info));
  });

  socket.on('disconnect', () => {
    updateUserInRoom();
  });
});

function buildMsgHtml(data) {
  const currentTime = new Date(data.time).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit'
  });
  const result = `
  <li class="message_item">
    <div class="message_avatar">
      <img src="${data.avatar}" />
    </div>
    <div class="message_content">
      <div class="message_title">
        <span class="message_name">${data.username}</span>
        <span class="message_time">${currentTime}</span>
      </div>
      <div class="message_text">
        <span>${data.message}</span>
      </div>
    </div>
  </li>`;
  return result;
}

function updateUserInRoom() {
  io.clients((err, client) => {
    numberOfMembers = client.length;
    io.emit('updatae number of members', numberOfMembers);
    if (client.length === 0) {
      history = [];
    }
  });
}
