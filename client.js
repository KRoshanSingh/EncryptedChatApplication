const socket = io()

let name;
let textarea = document.querySelector('#textarea')
let messageArea = document.querySelector('.message__area')
do {
    name = prompt('Please enter your name: ')
} while(!name)

textarea.addEventListener('keyup', (e) => {
    if(e.key === 'Enter') {
        sendMessage(e.target.value)
    }
})

function sendMessage(message) {
    console.log("Sent Original Message" + message)
    let encryptedMessage = CryptoJS.AES.encrypt(message, "1234").toString();
    console.log("Sent Encrypted Message" + encryptedMessage)
    let msg = {
        user: name,
        message: encryptedMessage.trim()
    }
    // Append 
    appendMessage({
        user: name,
        message: message
    }, 'outgoing')
    textarea.value = ''
    scrollToBottom()

    // Send to server 
    socket.emit('message', msg)

}

function appendMessage(msg, type) {
    let mainDiv = document.createElement('div')
    let className = type
    mainDiv.classList.add(className, 'message')
    let markup = `
        <h4>${msg.user}</h4>
        <p>${msg.message}</p>
    `
    mainDiv.innerHTML = markup
    messageArea.appendChild(mainDiv)
}

// Recieve messages 
socket.on('message', (msg) => {
    let decryptedMessage = CryptoJS.AES.decrypt(msg.message, "1234")
    console.log("Received Encrypted Message" + msg.message)
    msg.message = decryptedMessage.toString(CryptoJS.enc.Utf8)
    console.log("Received Decrypted Message" + msg.message)  
    appendMessage(msg, 'incoming')
    scrollToBottom()
})

function scrollToBottom() {
    messageArea.scrollTop = messageArea.scrollHeight
}
