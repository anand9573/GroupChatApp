async function senddata(e){
    try{
        e.preventDefault();
        const data={
            name:e.target.name.value,
            email:e.target.email.value,
            phone:e.target.phone.value,
            password:e.target.password.value,
        }
        const res=await axios.post('http://localhost:3000/user/signup',data);

        const sleep = m => new Promise(r => setTimeout(r, m))
            if(res.status===200){
                async function emailExist(){
                    const submit=document.getElementById('submit')
                    const h6=document.createElement('h6')
                    h6.textContent+=" * Email already exist";
                    submit.before(h6);
                    h6.style.color="red";
                    await sleep(4000);
                    h6.remove()
                }
                emailExist()
            }else if(res.status===201){
                window.location.href = "../../views/login.html";
            }
    }catch(err){
        document.body.innerHTML+=`<h3 style='color:red'>something went wrong try after sometime</h3>`
    }
   

}