# reactjournal

This web app was designed as a way to showcase how a website could have a simple database with multiple user accouns, and how the data would be compartmentalized for each user.

In this case, evey user is assigned a User Id (UID) by Firebase Authentication, and each UID that submits an entry creates a child node in the main database to save each entry to. The current user that is logged in is only authorized to view and edit the posts that live in their database node.

```
// When a user logs in:
firebase.auth().onAuthStateChanged(function(user) {
	// Load user-specific data
	if (user) {
	// Switch database directory reference
	itemsRef = firebase.database().ref(`entries/${firebase.auth().currentUser.uid}/`)
	// Take snapshot and load data into current state
	itemsRef.on('value', (snapshot) => {
	let entries = snapshot.val();
	let newState = [];
	for (let entry in entries) {
		newState.push({
			id: entry,
			title: entries[entry].title,
			articleBody: entries[entry].articleBody
			});
		}
		this.setState({
			entries: newState
		});
	 });
	} else {
	// If no user is logged in, load database nodes (impossible to reach this due to FirebaseAuthUI Flow, if user is not logged in, will be redirected to login screen)
	itemsRef = firebase.database().ref('entries/')
	itemsRef.on('value', (snapshot) => {
		let entries = snapshot.val();
		let newState = [];
		for (let entry in entries) {
			newState.push({
			id: entry,
			title: entries[entry].title,
			articleBody: entries[entry].articleBody
			});
		}
		this.setState({
			entries: newState
		});
	  });
	}
}
```

ReactJournal uses the Quill.js package, specifically the react-quill module, as the main editor.


