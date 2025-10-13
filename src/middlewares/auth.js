const authAdmin = (req, res, next) => {
    console.log('Authenticating Admin...');
    const token = "abcd";
    const isAdminAuthenticated = token === "abc";
    if(!isAdminAuthenticated) {
        res.send("Admin is not authenticated");
    }else{
        next();
    }
}

const authUser = (req, res, next) => {
    console.log('Authenticating User...');
    const token = "abc";
    const isAdminAuthenticated = token === "abc";
    if(!isAdminAuthenticated) {
        res.send("User is not authenticated");
    }else{
        next();
    }
}

module.exports = {
    authAdmin,
    authUser
}