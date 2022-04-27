////////////////////////////////////////extra for other profiles
//used for other profiles
async function loadDataProfile() {
	
	var authUser;
	database = await getDatabase();	
	//event listener for the "child added" event,
	  //also happens to list all current children of {@code ref}
	const ref = firebase.database().ref().child("users/");
	ref.on('child_added', (data) => {
		//This iterates through the children 
		//EACH INSTANCE OF {@code data} IS ONE (1) USER
		if(data.val()["name"] == document.getElementById('searchUser').value) {
			authUser = data.key;
		}
	});
	var para = new URLSearchParams();
	para.append("otherUid", authUser);
	window.location = "ProfilePage.html?" + para.toString();
}