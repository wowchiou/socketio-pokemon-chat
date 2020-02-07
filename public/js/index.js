(function() {
  let username = '訪客';
  const socket = io('http://localhost:9000');

  $(function() {
    $('#send-box').on('submit', function(e) {
      e.preventDefault();
      const message = $('#message-input').val();
      if (message.trim() !== '') {
        socket.emit('message to server', message);
        $('#message-input').val('');
      }
    });
  });

  socket.on('connect', () => {
    $('.user_wrap').on('submit', function(e) {
      e.preventDefault();
      const userValue = $('#user_name').val();
      if (userValue.trim() !== '') {
        username = userValue;
        switchPage();
        socket.emit('add user', username);
        $('.header_name').text(username);
      }
    });
  });

  socket.on('first come in room', data => {
    $('.header_avatar img').attr('src', data.avatar);
    $('.message')
      .empty()
      .append(data.history);
  });

  socket.on('updatae number of members', number => {
    $('.numberOfMenbers').text(number);
  });

  socket.on('message to client', html => {
    $('.message').append(html);
  });

  function switchPage() {
    $('.user').removeClass('active');
    $('.container').addClass('active');
  }
})();
