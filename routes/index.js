module.exports = function Route(app){
	//users contains all logged users. The key wiil be the sessionID
	var users = {
		1: {name:'NickJones'},
		2: {name:'SydneyNoteboom'},
		3: {name:'JayCruz'},
		4: {name:'PatrickEscalante'}
	}

	// conversation array contains the conversation
	var conversation = [
		{name: 'NickJones', text:'hello buddies'},
		{name: "Miguelon", text:"how's everything"},
		{name: "David", text:"Leaving the chat"}
	]

	//since this is a single page app, we'll only need the default http route!
	app.get("/", function(req,res){
		res.render("index");
	})
	
	//a new user arrives, we serve users list and conversation
	app.io.route('new_user', function(socket){
		console.log("the sessionID of the user that just entered: " + socket.sessionID)
		console.log("and his name as he entered in his prompt is: " + socket.data.name)

		//we add him to the users object
		users[socket.sessionID] = {name: socket.data.name};
		console.log(users[socket.sessionID]);
		console.log("this is the user jus added to users: " + users[socket.sessionID].name);

		//we add to the conversation the new arrival, emit the whole conversation to the new user and broadcast
		conversation.push( {name: users[socket.sessionID].name, text: ' ENTERS THE CHATROOM'} );
		socket.io.emit('whole_conversation',conversation)
		socket.io.broadcast('got_new_user', {name: socket.data.name, text: ' ENTERS THE CHATROOM'})
	})

	//listening for new chats
	app.io.route("new_chat", function(socket){
	
		//push the new chat to conversation 
		conversation.push( {name: users[socket.sessionID].name , text: socket.data.text} );
		//broadcast the new chat, but not the whole conversation
		//try to log each users 
		for (var j in users) {
			console.log(users[j].name);
		}
		//console.log("This are the users" + users) it doesn't work, we just get [object Object] in the console
		console.log("this is just the sessionID of the user that just emmited: " + socket.sessionID)
		//console.log("This is the name corresponsding to the sessionID of the user that just emmited: " + users[socket.sessionID].name);
		console.log("let's try to pass to the client: " + users[socket.sessionID].name + socket.data.text);
		socket.io.broadcast('update_chat', {name: users[socket.sessionID].name , text: socket.data.text} );
	})

	// app.io.route('disconnect', function(socket){
	// 	delete pirates[socket.sessionID];
	// 	socket.io.broadcast('someone_walked_the_plank',{id: socket.sessionID});
	// })

}