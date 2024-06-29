const postTextarea = document.getElementById("postTextarea");
const btnPost = document.getElementById("btnPost");

postTextarea.addEventListener("keyup", function(e) {
    const textBox = e.target;
    const value = textBox.value.trim();
    if(value ==""){
        btnPost.disabled = true;
        return;
    }
    btnPost.disabled = false;
});

getAllPost();
async function getAllPost(){
    const url = "http://localhost:4000/api/posts";
    const response = await fetch(url);
    const posts = await response.json();
    posts.forEach((post) => {
        const messages = document.querySelector(".messages");
        const content = createPost(post);
        messages.innerHTML = content + messages.innerHTML;
    });
    console.log(posts);
}

// save user post details
btnPost.addEventListener("click", function (e) { console.log("click")
    e.preventDefault();
    const url = "http://localhost:4000/api/posts";
    const data = new URLSearchParams();
    data.append("content", postTextarea.value);

    const xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded;charset=UTF-8");
    xhr.onreadystatechange = function () {
        if(xhr.readyState === 4 && xhr.status === 200){
            // console.log(xhr.responseText);
           const post = JSON.parse(xhr.responseText);
           const messages = document.querySelector(".messages");
           const htmlData = createPost(post);
           messages.insertAdjacentHTML("afterbegin", htmlData);
           postTextarea.value = "";
           btnPost.disabled = true;
        }else if(xhr.readyState === 4){
            console.error("Request failed with status: " + xhr.status)
        }
    }
    xhr.send(data);
});

function createPost(post) {
    const img = post.postedBy.profilePic;
    const activeBtn = post.likes.includes(userLoggedIn._id) ? "active" : "";
    let data = `
    <div class= 'post' data-id='${post._id}'>
      <div class='content-container'>
         <div class='user-pic'>
           <img src='${img}' alt='Profile Image' width='100px'>
         </div>
         <div class ="message-container">
          <div class="header">
           <div class="username">
             <a href="#">${post.postedBy.name}</a>
             <span>@${post.postedBy.username}</span>
           </div>
           <span class ="time">${timeFormat(new Date(), new Date(post.createdAt))}</span> 
          </div>
          <div class="body">${post.content}</div>
          <div class="footer">
          <button><ion-icon name="chatbubble-outline"></ion-icon></button>
          <button><ion-icon name="repeat-outline"></ion-icon></button>
          <button class="likeBtn ${activeBtn}">
          <ion-icon name="heart-outline"></ion-icon>
          <span>${post.likes.length || ""}</span>
          </button>
          </div>
         </div>
      </div>
    </div>    
    `;
    return data;
}

document.addEventListener("click", async function (event) {
   const target = event.target;
   if(target.classList.contains("likeBtn")){
    const likeBtn = target;
    const postId = getPostId(likeBtn);
    // console.log(postId)
    const url = `/api/post/${postId}/like`;
    const response = await fetch(url, {method: "PUT"});
    const posts = await response.json();
    likeBtn.querySelector("span").textContent = posts.likes.length || "";
    if(posts.likes.includes(userLoggedIn._id)){
      likeBtn.classList.add("active");
    } else {
      likeBtn.classList.remove("active");
    }
   }
})

function getPostId(element) {
   const isRoot = element.classList.contains("post");
   const rootElement = isRoot=="true" ? element : element.closest(".post");
   const postId = rootElement.dataset.id;
   if(postId === undefined) {
    return alert("Post id undefined");
   }
   return postId;
}

//*********************************************************** */
function timeFormat (current, previous) {
   const msPerMinute = 60 * 1000;
   const msPerHour = msPerMinute * 60;
   const msPerDay = msPerHour * 24;
   const msPerMonth = msPerDay * 30;
   const msPerYear = msPerMonth * 365;
   const diff = current - previous;
   if(diff < msPerMinute){
    if(diff / 1000 < 30) return "Just Now";
     return Math.round(diff / 1000) + "seconds ago";
   } else if (diff < msPerHour){
     return Math.round(diff / msPerMinute) + "minutes ago";
   } else if (diff < msPerDay) {
     return Math.round(diff / msPerHour) + "hours ago";
   } else if (diff / msPerMonth) {
     return Math.round(diff / msPerDay) + "days ago";
   } else if (diff / msPerYear) {
     return Math.round(diff / msPerMonth) + "months ago";
   } else {
    return Math.round(diff / msPerYear) + "years ago";
   }
} 