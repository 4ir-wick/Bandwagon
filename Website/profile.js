//Eric Stevens
var dbUser = undefined;
var storRef = undefined;

async function loadData() {
	var para = new URLSearchParams(window.location.search);
	var otherUid = para.get("otherUid");
	auth = await getAuth();
	authUser = await getAuthUser(auth);
	database = await getDatabase();
	if (otherUid != undefined) {
		dbUser = await getOtherUser(database, otherUid);
		$("#profile header > button").css("display", "none");
	} else {
		dbUser = await getUser(database, authUser);
	}
	userData = await getUserData(dbUser);
	storRef = await getStorageRef();
	for (let [key, value] of Object.entries(userData)) {
		if (typeof value == "string") {
			if (value != "") {
				$("#" + key).html(value);
			}
		} else if (typeof value == "object") {
			if ((key != "images") && (key != "audio")) {
				$("#" + key).empty();
			}
			for (let [key2, value2] of Object.entries(value)) {
				if ((key == "images") || (key == "audio")) {
					$("#" + key2).attr("src", value2);
				} else {
					$("#" + key).append("<li>" + value2 + "</li>");
				}
			}
		}
	}
}

$(document).ready(async () => {
	await loadData();
	let editPfp = $("#profile header #editProfile");
	editPfp.click(function() {
		let pageEditing = editPfp.attr("pageEditing");
		if (pageEditing == "false" || pageEditing == undefined) {
			editPfp.attr("pageEditing", "true");
			editPfp.html("Save Changes");
			$("#profile header div").children().mouseenter(function(){editButton($(this),textEdit);});
			$("#fit").children().mouseenter(function(){editButton($(this),imageEdit);});
			$("#profile aside").children().mouseenter(function(){editButton($(this),listEdit);});
			$("#profile section").children().mouseenter(function(){editButton($(this),listEdit);});
		} else if (pageEditing == "true") {
			editPfp.attr("pageEditing", "false");
			editPfp.html("Edit Profile");
			let editables = $("#profile header div").children();
			editables = editables.add($("#fit").children());
			editables = editables.add($("#profile aside").children());
			editables = editables.add($("#profile section").children());
			editables.unbind('mouseenter');
			editables.each(function(index) {
				let element = editables.eq(index);
				let tag = element.prop("tagName");
				//console.log(tag);
				if (tag == "IMG") {
					let img = element[0];
					//console.log(dbUser + "images: {" + img.id + ": " + img.src + "}");
					dbUser.child("images").update({[img.id]: img.src});
				} else if (tag == "DIV") {
					let list = element.find("ul, ol").eq(0);
					if (list[0] != undefined) {
						let dbIndex = list.attr("id");
						let listItems = list.children();
						let listSave = {};
						for (let i in listItems.toArray()) {
							let listItem = listItems.eq(i);
							//console.log(dbIndex + ": {" + i + ": " + listItem.text() + "}");
							listSave[i] = listItem.text()
						}
						dbUser.child(dbIndex).set(listSave);
					} else {
						let img = element.find("img").eq(0)[0];
						//console.log(dbUser + "images: {" + img.id + ": " + img.src + "}");
						dbUser.child("images").update({[img.id]: img.src});
					}
				} else {
					//console.log(dbUser + ": {" + element.attr("id") + ": " + element.html() + "}");
					dbUser.update({[element.attr("id")]: element.html()});
				}
			});
		}
	});
});

function editButton(self, editFunc) {
	var button = $("#editButton");
	if (button[0] == undefined) {
		button = $("<button>", {id: "editButton"});
		button.click(function(){editFunc(button);});
		self.wrap("<div id='buttonContainer'></div>");
		self.after(button);
		container = self.parent();
		container.mouseleave(function() {
			button.remove();
			self.unwrap();
		});
	}
}

function textEdit(button) {
	var editable = button.prev();
	var isEditable = editable.attr("contenteditable");
	if (isEditable == "false" || isEditable == undefined) {
		editable.attr("contenteditable", "true");
		editable.css("border-style", "solid");
	} else if (isEditable == "true" && editable.html() != "") {
		editable.attr("contenteditable", "false");
		editable.css("border-style", "none");
	}
}

function imageEdit(button) {
	var image = button.parent().find("img")[0];
	var fileInput = $("<input>", {type: "file"});
	fileInput.click();
	fileInput.change(async () => {
		file = fileInput[0].files[0]
		var name = new Date() + "-" + file.name;
		var imageUrl = await putStorage(storRef, name, file);
		image.src = imageUrl;
	});
}

function listEdit(button) {
	let list = button.parent().find("ul, ol").eq(0);
	let beingEdited = list.attr("beingEdited");
	if (beingEdited == undefined) {
		let listItems = list.children();
		for (let i in listItems.toArray()) {
			let listItem = listItems.eq(i);
			listItem.after("<button>edit</button>");
			let editButton = listItem.next();
			editButton.click(function(){textEdit(editButton);});
			editButton.after("<button style='background-color: red'>-</button>");
			let deleteButton = editButton.next();
			deleteButton.click(function(){listItem.remove();editButton.remove();deleteButton.remove();});
		}
		list.append("<button style='background-color: green'>+</button>");
		let addButton = list.children().last();
		addButton.click(function(){list.append("<li>new</li>");list.append(addButton);listEdit(button);listEdit(button);});
		list.attr("beingEdited", true);
	} else {
		list.find("button").each(function(index, element){
			element.remove();
		});
		list.children().each(function(index, element){
			let ele = $(element);
			if (ele.attr("contenteditable") == "true") {
				ele.attr("contenteditable", "false");
				ele.css("border-style", "none");
			}
		});
		list.removeAttr("beingEdited");
	}
}
//Eric Stevens