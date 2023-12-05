const socket = io()

document.getElementById('email-form').addEventListener('submit', (e) => {
    e.preventDefault();

    const emailInput = document.getElementById('email');
    const email = emailInput.value;
    emailInput.value = '';

    const comInput = document.getElementById('com');
    const comment = comInput.value;
    comInput.value = '';
    console.log(email)
    console.log(comment)

    socket.emit("newEmail",{email:email,comment:comment});

    }
)

//lis