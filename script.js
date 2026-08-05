window.addEventListener("load", () => {
    clock();
    function clock() {
      const today = new Date();
  
   
      const hours = today.getHours();
      const minutes = today.getMinutes();
      const seconds = today.getSeconds();

      const hour = hours < 10 ? "0" + hours : hours;
      const minute = minutes < 10 ? "0" + minutes : minutes;
      const second = seconds < 10 ? "0" + seconds : seconds;
  
     
      const hourTime = hour > 12 ? hour - 12 : hour;
  
     
      const ampm = hour < 12 ? " AM" : " PM";
  
   
      const month = today.getMonth();
      const year = today.getFullYear();
      const day = today.getDate();
  
    
      const monthList = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December"
      ];
  
      const date = monthList[month] + " " + day + ", " + year;
      const time = hourTime + ":" + minute + ":" + second + ampm;
  

      const dateTime = date + " - " + time;
  
     
      document.getElementById("date-time").innerHTML = dateTime;
      setTimeout(clock, 1000);
    }
  });

  const audio = document.getElementById("dogsong2");
  const playbutton = document.getElementById("playbtn");
  const playtext = document.getElementById("playtext");

  playbutton.addEventListener("click", function() {
    if(audio.paused){
        audio.play();
        playtext.textContent="pause"
        
    } else {
        audio.pause();
        playtext.textContent = "play";
        
    };
  });

  const canvas = document.getElementById("drawingCanvas");
  const ctx = canvas.getContext("2d");
  
  const clearButton = document.getElementById("clearButton");
  const submitButton = document.getElementById("submitButton");
  
  let drawing = false;
  
  ctx.lineWidth = 4;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.strokeStyle = "maroon";
  
  
  canvas.addEventListener("pointerdown", startDrawing);
  canvas.addEventListener("pointermove", draw);
  canvas.addEventListener("pointerup", stopDrawing);
  canvas.addEventListener("pointerleave", stopDrawing);
  
  
  function getPosition(event) {
  
      const rect = canvas.getBoundingClientRect();
  
      return {
          x: (event.clientX - rect.left) * (canvas.width / rect.width),
          y: (event.clientY - rect.top) * (canvas.height / rect.height)
      };
  
  }
  
  
  function startDrawing(event) {
  
      drawing = true;
  
      const position = getPosition(event);
  
      ctx.beginPath();
      ctx.moveTo(position.x, position.y);
  
  }
  
  
  function draw(event) {
  
      if (!drawing) {
          return;
      }
  
      const position = getPosition(event);
  
      ctx.lineTo(position.x, position.y);
      ctx.stroke();
  
  }
  
  
  function stopDrawing() {
  
      drawing = false;
      ctx.beginPath();
  
  }
  
  
  clearButton.addEventListener("click", function() {
  
      ctx.clearRect(
          0,
          0,
          canvas.width,
          canvas.height
      );
  
  });

  


const SUPABASE_URL = "https://satmvyxotlghtrqmvicb.supabase.co";
const SUPABASE_KEY = "sb_publishable_C8iBx4egDtEn5yeSzM_DWA_ksC94fYe";

const supabaseClient = supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);


submitButton.addEventListener("click", async function() {

    console.log("submit clicked!");

    const imageBlob = await new Promise(function(resolve) {
        canvas.toBlob(resolve, "image/png");
    });

    const fileName = `${Date.now()}-${crypto.randomUUID()}.png`;


    // Upload image to Supabase Storage

    const { error: uploadError } =
        await supabaseClient.storage
            .from("drawings")
            .upload(fileName, imageBlob, {
                contentType: "image/png"
            });


    if (uploadError) {

        console.error("Upload error:", uploadError);

        alert("something went wrong uploading your doodle :(");

        return;
    }


    // Get public URL

    const { data } =
        supabaseClient.storage
            .from("drawings")
            .getPublicUrl(fileName);


    // Save URL to database

    const { error: databaseError } =
        await supabaseClient
            .from("doodles")
            .insert([
                {
                    image_url: data.publicUrl
                }
            ]);


    if (databaseError) {

        console.error("Database error:", databaseError);

        alert("your drawing uploaded, but something went wrong saving it :(");

        return;
    }


    alert("your doodle has been added!! ♡");

});

const chatMessages = document.getElementById("chatMessages");
const usernameInput = document.getElementById("usernameInput");
const messageInput = document.getElementById("messageInput");
const sendMessageButton = document.getElementById("sendMessageButton");


// LOAD MESSAGES

async function loadMessages() {

    const { data, error } = await supabaseClient
        .from("chat_messages")
        .select("*")
        .order("created_at", { ascending: true });


    if (error) {

        console.error("Could not load messages:", error);

        return;
    }


    chatMessages.innerHTML = "";


    data.forEach(function(message) {

        const messageElement = document.createElement("p");

        messageElement.classList.add("mb-2");

        const date = new Date(message.created_at);

const formattedDate = date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric"
});

const formattedTime = date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit"
});

messageElement.textContent =
    `[${formattedDate} ${formattedTime}] ${message.username}: ${message.message}`;

        chatMessages.appendChild(messageElement);

    });


    chatMessages.scrollTop = chatMessages.scrollHeight;
}



// SEND MESSAGE

async function sendMessage() {

    const username = usernameInput.value.trim();
    const message = messageInput.value.trim();


    if (username === "" || message === "") {

        return;

    }


    const { error } = await supabaseClient
        .from("chat_messages")
        .insert([
            {
                username: username,
                message: message
            }
        ]);


    if (error) {

        console.error("Could not send message:", error);

        return;

    }


    messageInput.value = "";

    loadMessages();

}



// SEND BUTTON

sendMessageButton.addEventListener(
    "click",
    sendMessage
);



// LOAD CHAT WHEN PAGE OPENS

loadMessages();

async function updateDoodleCount() {

    const { count, error } = await supabaseClient
        .from("drawings")
        .select("*", {
            count: "exact",
            head: true
        });

    if (error) {
        console.error("Could not get doodle count:", error);
        return;
    }

    const doodleCount = count ?? 0;

    document.getElementById("doodle-count").textContent =
        String(doodleCount).padStart(5, "0");
}


async function updateVisitorCount() {

    // Get current count
    const { data, error } = await supabaseClient
        .from("visitors")
        .select("visitors")
        .eq("id", 1)
        .single();

    if (error) {
        console.error("Could not get visitor count:", error);
        return;
    }


    // Increase count by 1
    const newCount = data.visitors + 1;


    // Save new count
    const { error: updateError } = await supabaseClient
        .from("visitors")
        .update({
            visitors: newCount
        })
        .eq("id", 1);


    if (updateError) {
        console.error("Could not update visitor count:", updateError);
        return;
    }


    // Display it
    document.getElementById("visitor-count").textContent =
        String(newCount).padStart(5, "0");
}
updateVisitorCount();
updateDoodleCount();
