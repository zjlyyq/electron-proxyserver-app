const information = document.getElementById('info')
information.innerText = `本应用正在使用 Chrome (v${versions.chrome()}), Node.js (v${versions.node()}), 和 Electron (v${versions.electron()})`

async function sendMsg() {
  // alert('ping')
  const res = await versions.ping('192.168.1.1');
  versions.send('msg-from-renderer', 'hello from render process');
  console.log(res);
}
versions.listen('message-to-renderer' , (data) => {
  document.querySelector('.msg_content').innerHTML += data + '\r\n';
})
document.querySelector('#send_msg_btn').addEventListener('click', async () => {
  sendMsg();
});