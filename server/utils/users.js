class Users {
    constructor () {
        this.users = [];
    }
    addUser (id, name, room) {
        var user = {id, name, room};
        this.users.push(user);
        return user;
    }
    removeUser (id) {
        var user = this.getUser(id);
    
        if (user) {
            this.users = this.users.filter((user) => user.id !== id);
        }
    
        return user;
    }
    getUser (id) {
        return this.users.filter((user) => user.id === id)[0];
    }

    checkUserName(name, room) {
        let userList = this.getUserList(room);
        if (userList && userList.length > 0) {
            let user = userList.filter((n) => n == name)[0];
            if (user) {
                return true;
            }
        }
        return false;
    }

    getUserList (room) {
        var users = this.users.filter((user) => user.room === room);
        var namesArray = users.map((user) => user.name);
    
        return namesArray;
    }
}
  
module.exports = {Users};