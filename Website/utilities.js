before();

async function before() {
	await load($(document.currentScript), "..\\Includable\\header.html");
}

function load(element, path) {
	return new Promise(resolve => {
		$.get(path, (data) => { element.before(data); resolve(); });
	});
}

function whenAvailable(name) {
	return new Promise(resolve => {
		var intervalID = setInterval(() => {
			if(window[name]) {
				clearInterval(intervalID);
				resolve();
			}
		}, 1);
	});
}

function getAuth() {
	return new Promise(async resolve => {
		await whenAvailable("firebase");
		var intervalID = setInterval(() => {
			if(typeof(firebase.auth) === "function") {
				clearInterval(intervalID);
				resolve(firebase.auth());
			}
		}, 1);
	});
}

async function getAuthUser(auth) {
	return new Promise(async resolve => {
		auth.onAuthStateChanged(user => {
			if (user) {
				resolve(user);
			} else {
				error("Could not get current user");
			}
		});
	});
}


function getDatabase() {
	return new Promise(async resolve => {
		await whenAvailable("firebase");
		var intervalID = setInterval(() => {
			if(typeof(firebase.database) === "function") {
				clearInterval(intervalID);
				resolve(firebase.database());
			}
		}, 1);
	});
}

async function getUser(database, authUser) {
	return new Promise(async resolve => {
		resolve(database.ref().child('users/' + authUser.uid));
	});
}

async function getOtherUser(database, uid) {
	return new Promise(async resolve => {
		resolve(database.ref().child('users/' + uid));
	});
}

async function getUserData(dbUser) {
	return new Promise(async resolve => {
		dbUser.get().then(snapshot => {
			if (snapshot.exists()) {
				resolve(snapshot.val());
			}
		});
	});
}

function getStorageRef() {
	return new Promise(async resolve => {
		await whenAvailable("firebase");
		var intervalID = setInterval(() => {
			if(typeof(firebase.storage) === "function") {
				clearInterval(intervalID);
				resolve(firebase.storage().ref());
			}
		}, 1);
	});
}

function putStorage(ref, name, file) {
	return new Promise(async resolve => {
		const metadata = {
			contentType: file.type
		};
		const storeRef = ref.child(name).put(file, metadata);
		storeRef
		.then(snapshot => snapshot.ref.getDownloadURL())
        .then(url => {
            resolve(url);
        })
		.catch(console.error);
	});
}

stickies = {};
var init = false;
if (init == false) {
	$(document).ready(ready);
	init = true;
}

async function ready() {
	await loadIncludes();
	
	var index = 0;
	$("[sticky]").each(function () {
		var sticky = $(this);
		stickies[index] = {	"top": sticky.offset().top};
		sticky.attr("sticky", index);
		index++;
	});
}

async function loadIncludes() {
	var includes = $("[include]");
	for (let include of includes) {
		var path = "..\\Includable\\" + include.getAttribute("include");
		await load($(include), path);
	}
	$("[include]").each(function() {
		$(this).replaceWith($(this).html());
	})
}

$(window).scroll(function() {
	for ([key, stickyData] of Object.entries(stickies)) {
		var windowTop = $(window).scrollTop();
		var stickyTop = stickyData["top"];
		var sticky = $("[sticky=" + key + "]");
		if (stickyTop < windowTop) {
			sticky.css("position", "fixed");
		} else {
			sticky.css("position", "relative");
		}
	}
});
//////////////////////////////ender search fuction
function userSearch()
{

	console.log(document.getElementById("profileImg"));
	const ref = firebase.database().ref().child("users/");

	//event listener for the "child added" event,
	  //also happens to list all current children of {@code ref}
	ref.on('child_added', (data) => {
	//This iterates through the children 
	//EACH INSTANCE OF {@code data} IS ONE (1) USER
	if(data.val()["name"] == document.getElementById('searchUser').value)
	{
		//profile image, name, instruments, genres
		document.getElementById('profileImg').src = data.val()["images"]["iconImage"];
		document.getElementById('displayName').textContent = data.val()["name"];
		document.getElementById('instrument1').textContent = data.val()["instruments"][0];
		document.getElementById('instrument2').textContent = data.val()["instruments"][1];
		document.getElementById('genre1').textContent = data.val()["instruments"][0];
		document.getElementById('genre2').textContent = data.val()["instruments"][1];
	}
	});
}