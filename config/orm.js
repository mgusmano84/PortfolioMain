var mysql = require('mysql');


// Heroku ACCESS

// var connection = mysql.createConnection(process.env.JAWSDB_URL);

// connection.connect();

// connection.query('SELECT 1 + 1 AS solution', function(err, rows, fields) {
//   if (err) throw err;

//   console.log('The solution is: ', rows[0].solution);
// });

// Local ACCESS

var connection = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: process.argv[2],
	database: 'ClassroomCentral'
});

// Connects to MySQL DataBase
function connectToDB(){
	connection.connect(function(err){
		if (err) {
			console.error('error connection:', err.stack);
			return
		}
		console.log('connected to MySQL')
	});
}

module.exports.connectToDB = connectToDB;

// Allows user to be added if teacher or not
function addUserToDB(userObj, callback){

    if (userObj.isTeacher) {
        addNewClass(userObj, function(results, err){
            console.log('results are',results, err);
            userObj.classId = results.insertId;
            saveUserToDB(userObj);
        })
    } else {
        saveUserToDB(userObj)
    }

// This will push user to MySQL
    function saveUserToDB(newUserObj){
        connection.query('INSERT INTO Users SET ?', newUserObj, function(err, results){
            if (err) {
                console.log(err) 
                return callback(false, err)
            }
            console.log('results are 1', results)
            callback(true, null)
        });
    }
}

// Adds to new class to teacher that other families will fall under
function addNewClass(userObj, callback) {
    connection.query('INSERT INTO Class SET ?', {teacherName: userObj.username}, function(err, results){
        if (err) return callback(false, err);
        callback(results, null)
    });    
}

module.exports.addUserToDB = addUserToDB;

// User Search
function findUser(username, callback){
	connection.query('SELECT * FROM Users WHERE ?', {username: username}, function(err, user){
		callback(err, user)
	})
}

module.exports.findUser = findUser;

// Add Post
function makePost(postMessage, userIn, classId, userName){
	postIt = [
		postMessage,
		userIn,
		classId,
		userName
	];
	connection.query('INSERT INTO Post (text, userId, classId, usernameP) VALUES (?, ?, ?, ?)',postIt, function(err, results){
		if (err) throw err;
		console.log(results);
		});
		// console.log(query.sql)
}

module.exports.makePost = makePost;

// Allows user posts to be deleted
function deletePost(msgId, callback){
		connection.query('DELETE FROM Post WHERE msg_id = ? limit 1' , msgId, function(err, results){
		if (err) throw err;
		console.log(results);
		callback(results)
		});
}

module.exports.deletePost = deletePost;


// Allows users under teacher class to be displayed in teacher add user section
function displayUsers(ClassID, callback){
	connection.query('SELECT * FROM Users WHERE isTeacher = 0 AND classId =?' , ClassID, function(err, results){
		if (err) throw err;
		console.log("orm check:" + results);
		callback(results)
		});
		
}

module.exports.displayUsers = displayUsers;

// This will alow users to be deleted
function deleteUser(userId, callback){
		connection.query('DELETE FROM Users WHERE userId = ? limit 1' , userId, function(err, results){
		if (err) throw err;
		console.log(results);
		callback(results)
		});
}

module.exports.deleteUser = deleteUser;

// This will allow posts to display on userpage
function displayPost(ClassID, callback){
	console.log("CLassid" + ClassID);
	connection.query('SELECT *, DATE_FORMAT(created, "%b %d %Y %h:%i %p") as created FROM Post WHERE classId = ?' , ClassID, function(err, results){
		if (err) throw err;
		console.log("orm check:" + results);
		callback(results)
		});
		
}

module.exports.displayPost = displayPost;

// Make a homework post to userpage by the teacher
function homeworkPost(homeworkpost, userIn, classid){
	postItt = [
		homeworkpost,
		userIn,
		classid
	];
	connection.query('INSERT INTO Homework (text, userId, classId) VALUES (?, ?, ?)',postItt, function(err, results){
		if (err) throw err;
		console.log(results);
		});
		
}

module.exports.homeworkPost = homeworkPost;

// Delete homework post requested
function deleteHomework(hmId, callback){
		connection.query('DELETE FROM Homework WHERE hm_id = ?' , hmId, function(err, results){
		if (err) throw err;
		console.log(results);
		callback(results)
		});
}

module.exports.deleteHomework = deleteHomework;

// Allows creaation of event post
function eventPost(eventPost, userIn, classid){
	postIt = [
		eventPost,
		userIn,
		classid
	];
	connection.query('INSERT INTO NewEvents (text, userId, classId) VALUES (?, ?, ?)',postIt, function(err, results){
		if (err) throw err;
		console.log(results);
		});
		
}

module.exports.eventPost = eventPost;

// Deletes Event Post
function deleteEvent(evId, callback){
		connection.query('DELETE FROM NewEvents WHERE ev_id = ?' , evId, function(err, results){
		if (err) throw err;
		console.log(results);
		callback(results)
		});
}

module.exports.deleteEvent = deleteEvent;


// This will display homework
function displayHomework(ClassID, callback){
	connection.query('SELECT * FROM Homework WHERE classId = ?' , ClassID, function(err, results){
		if (err) throw err;
		callback(results)
		});
		
}

module.exports.displayHomework = displayHomework;

// This will display Events
function displayEvents(ClassID, callback){
	connection.query('SELECT * FROM NewEvents WHERE classId = ?' , ClassID, function(err, results){
		if (err) throw err;
		callback(results)
		});
		
}

module.exports.displayEvents = displayEvents;
