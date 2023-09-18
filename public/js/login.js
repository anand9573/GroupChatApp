async function login(e){
    try{
        e.preventDefault()
        const data={
            name:e.target.name.value,
            password:e.target.password.value
        }
        const res=await axios.post('http://localhost:3000/user/login',data);

    }catch(err){
        document.body.innerHTML='<h5>something went wrong<h5>';
    }
}