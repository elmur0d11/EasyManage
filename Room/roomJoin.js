const API_URL = "http://localhost:8081/api/v1/room/join";

const joinBtn = document.getElementById("joinBtn");

joinBtn.addEventListener("click", joinRoom);

async function joinRoom() {

    const roomCode = document.getElementById("roomCode").value.trim();

    const message = document.getElementById("message");

    if(roomCode === ""){

        message.style.color = "red";
        message.textContent = "Please enter room code.";
        return;

    }

    const token = localStorage.getItem("accessToken");

    if(!token){

        message.style.color = "red";
        message.textContent = "You are not logged in.";
        return;

    }

    try{

        const response = await fetch(API_URL,{

            method:"POST",

            headers:{

                "Content-Type":"application/json",
                "Authorization":"Bearer " + token

            },

            body:JSON.stringify({

                roomCode:roomCode

            })

        });

        const data = await response.json();

        if(response.ok){

            message.style.color="green";
            message.textContent=data.message;

            document.getElementById("roomCode").value="";

        }
        else{

            message.style.color="red";
            message.textContent=data.message || "Unable to join room.";

        }

    }
    catch(error){

        message.style.color="red";
        message.textContent="Server connection failed.";

    }

}

function goDashboard(){

    window.location.href="../Dashboard/dashboard.html";

}