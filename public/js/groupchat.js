async function sendmsg(e){
    e.preventDefault();
    const messages={msg:e.target.msg.value}
    const token=localStorage.getItem('token')
    const res=await axios.post('http://localhost:3000/msgbox/groupchat',messages,{headers:{"Authorization":token}});
    console.log(res.data.messages);
    const msg=document.getElementById('msg');
    const decodeToken=parseJwt(token);
    msg.innerHTML+=`<h6 class="border bg-light">${decodeToken.name} : ${res.data.messages.msg}</h6>`
}

async function getusers(){
    const token=localStorage.getItem('token')
    const res=await axios.get('http://localhost:3000/msgbox/active-users',{headers:{"Authorization":token}});
    console.log(res.data.users);
    const decodeToken=parseJwt(token);
    const msg=document.getElementById('msg');
    res.data.users.forEach((user)=>{
        msg.innerHTML+=`<h6 class="border bg-light">${user.name} has Joined the chat</h6>`
    })
}
window.addEventListener('DOMContentLoaded',async()=>{
    try{
        getusers()
    
    }catch(err){
    console.log(err)
    } 
    })

function parseJwt (token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}