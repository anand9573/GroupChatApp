async function sendmsg(e){
    e.preventDefault();
    const messages={msg:e.target.msg.value}
    const token=localStorage.getItem('token')
    const res=await axios.post('http://localhost:3000/msgbox/groupchat',messages,{headers:{"Authorization":token}});
    console.log(res.data.messages);
    const msg=document.getElementById('msg');
    const decodeToken=parseJwt(token);
    msg.innerHTML+=`<h6 class="text-end fst-italic text-success">${decodeToken.name} : ${res.data.messages.msg}</h6>`
}

async function creategroup(e){
    try{
        e.preventDefault();
        const token=localStorage.getItem('token')
        const groupname=e.target.groupname.value
        const res=await axios.post('http://localhost:3000/user/groups',{groupname},{headers:{"Authorization":token}})
        
        const groups=document.getElementById('groups');
        if(res.status===201){

            groups.innerHTML=''
            const mygroup=[]
            console.log(res.data)
            for(const group of res.data.groups){
                mygroup.push({groupname:group.groupName})
            }
            localStorage.setItem('mygroups',JSON.stringify(mygroup));
            const mygroups=JSON.parse(localStorage.getItem('mygroups'));
            for(const group of mygroups){
                groups.innerHTML+=`<li style="list-style-type: none;" class="border"><a href="http://localhost:3000/user/groups/${group.groupname}">${group.groupname}</a></li>`
            }

            alert('group created successfully')
            window.location.href='../../views/groupchat.html'
            console.log('exited')
        }
    }catch(err){
        const message=async (err)=>{
            const sleep = m => new Promise(r => setTimeout(r, m))
            const submit=document.getElementById('submit')
            const h6=document.createElement('h6')
            h6.textContent+=`${err.response.data.message}`
            h6.style.color='red'
            submit.before(h6)
            await sleep(4000);
            h6.remove()
        }
        message(err)
    }
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
        msg.innerHTML=`<h3 style="position: fixed;width:65vw" class="bg-success text-end p-1"><button class="text-white btn fw-bolder btn-dark" data-bs-toggle="modal" data-bs-target="#popup">...</button></h3><br><br>`
        const users=[]
        for(const user of res.data.users){
            users.push({name:user.name,id:user.id})
        }
        localStorage.setItem('users',JSON.stringify(users));
        const useractive=JSON.parse(localStorage.getItem('users'));
        for(const user of useractive){
            msg.innerHTML+=`<h6 class="fst-italic text-center text-warning">${user.name} has Joined the chat</h6>`
        }
        const message=[]
        for(const obj of res.data.msgs){
            message.push({name:decodeToken.name,msgs:obj.msg,id:obj.id})
        }
        localStorage.setItem('messages',JSON.stringify(message));
        const messages=JSON.parse(localStorage.getItem('messages'));

    for(const obj of messages){
        msg.innerHTML+=`<h6 class="text-end fst-italic text-success">${decodeToken.name} : ${obj.msgs}</h6>`
    }
    }catch(err){
        console.log(err)
    }
}

window.addEventListener('DOMContentLoaded',async()=>{
    const messages=JSON.parse(localStorage.getItem('messages'));
    if(messages.length!==0){
        var lastmsgid=messages[messages.length-1].id
        if(lastmsgid===undefined){
            lastmsgid=10
        }
    }else{
        var lastmsgid=40
    }
    const token=localStorage.getItem('token');
    const res=await axios.get(`http://localhost:3000/msgbox/getmsgs/${lastmsgid}`,{headers:{"Authorization":token}});
    displayMsg(res);
    const groups=document.getElementById('groups');
    groups.innerHTML+=`<br>`
    const mygroups=JSON.parse(localStorage.getItem('mygroups'));
            for(let group of mygroups){
                console.log(group.groupname)
                groups.innerHTML+=`<li style="border-bottom: 2px solid white; margin: 10px 0; padding: 10px; display: flex; justify-content: space-between; align-items: center;"><button class="btn text-white fw-bolder" onclick="groupmsg('${group.groupname}')">${group.groupname}</button>
              </li>`
}
})
async function groupmsg(groupname){
    try{
        const token=localStorage.getItem('token');
        const res=await axios.get(`http://localhost:3000/user/groups/${groupname}`,{headers:{"Authorization":token}});
        console.log(res.data);
    }catch(err){
        console.log(err)
    }
} 

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