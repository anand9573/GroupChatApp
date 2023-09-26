async function login(e){
    try{
        e.preventDefault()
        const data={
            email:e.target.email.value,
            password:e.target.password.value
        }
        const res=await axios.post('http://localhost:3000/user/login',data);
        if(res.status===201){
            localStorage.setItem('token',res.data.token);
            window.location.href = "http://localhost:3000/groupchatapp";
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