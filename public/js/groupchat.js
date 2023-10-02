async function sendmsg(e){
    e.preventDefault();
    const messages={msg:e.target.msg.value}
    const token=localStorage.getItem('token')
    const res=await axios.post('http://localhost:3000/msgbox/groupchat',messages,{headers:{"Authorization":token}});
    console.log(res.data.messages);
    const msg=document.getElementById('msg');
    const decodeToken=parseJwt(token);
    msg.innerHTML+=`<h6 class="border text-success">${decodeToken.name} : ${res.data.messages.msg}</h6>`
}

async function getusers(){
    const token=localStorage.getItem('token')
    const res=await axios.get('http://localhost:3000/msgbox/active-users',{headers:{"Authorization":token}});
    displayMsg(res)

}

async function displayMsg(res){
    try{
        const token=localStorage.getItem('token');
        const decodeToken=parseJwt(token);
        const msg=document.getElementById('msg');
        msg.innerHTML=''
        const users=[]
        for(const user of res.data.users){
            users.push({name:user.name,id:user.id})
        }
        localStorage.setItem('users',JSON.stringify(users));
        const useractive=JSON.parse(localStorage.getItem('users'));
        for(const user of useractive){
            msg.innerHTML+=`<h6 class="border text-warning">${user.name} has Joined the chat</h6>`
        }
        const message=[]
        for(const obj of res.data.msgs){
            message.push({name:decodeToken.name,msgs:obj.msg,id:obj.id})
        }
        localStorage.setItem('messages',JSON.stringify(message));
        const messages=JSON.parse(localStorage.getItem('messages'));

    for(const obj of messages){
        msg.innerHTML+=`<h6 class="border text-success">${decodeToken.name} : ${obj.msgs}</h6>`
    }
    }catch(err){
        console.log(err)
    }
}

window.addEventListener('DOMContentLoaded',async()=>{
    const messages=JSON.parse(localStorage.getItem('messages'));
    const lastmsgid=messages[messages.length-1].id
    if(lastmsgid===undefined){
        lastmsgid=-1
    }
    const token=localStorage.getItem('token');
    const res=await axios.get(`http://localhost:3000/msgbox/getmsgs/${lastmsgid}`,{headers:{"Authorization":token}});
    displayMsg(res);
})

const update=async()=>{
    try{
        const interval=setInterval(function getmsgs() {
            getusers();
        }, 3000);
        // clearInterval(interval)
    }catch(err){
            console.log(err)
    } 
}
// update()

function parseJwt (token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}