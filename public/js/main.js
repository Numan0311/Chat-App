
const chatForm=document.getElementById('chat-form');

const chatMessages=document.querySelector('.chat-messages');
const roomName=document.getElementById('room-name')
const userList=document.getElementById('users')


// Get Username from URL

const {username,room}=Qs.parse(location.search,{
    ignoreQueryPrefix:true,
})


const socket= io();

// Join Room

socket.emit('joinRoom',{username,room});

// Get Room and Users
socket.on('roomUsers',({room,users})=>{
    outputRoomName(room);
    outputUsers(users);

})

// Message from Server
socket.on('message',message=>{

    outputMessage(message);

    // Scroll Down
    chatMessages.scrollTop=chatMessages.scrollHeight;
});


// Message Submit
chatForm.addEventListener('submit',(e)=>{
    e.preventDefault();
    const msg=e.target.elements.msg.value;

    // Emit a message to Server
   socket.emit('chatMessage',msg);

   // Clear Input
    e.target.elements.msg.value='';
    e.target.elements.msg.focus();
})


// Output Message using DOM
function outputMessage(message){
    const div=document.createElement('div')
    div.classList.add('message');
    div.innerHTML=`<p class="meta">${message.username} <span>${message.time}</span></p>
    <p class="text">
    ${message.text}
</p>`;
    document.querySelector('.chat-messages').appendChild(div)
}


// Add Rooms
function outputRoomName(room){
    roomName.innerText=room;
}

// Add Users
function outputUsers(users){


    userList.innerHTML=`
    ${users.map(user=>`<li>${user.username}</li>`).join('')}
    `;
}