if (Meteor.isClient) {

	 // add helper 
  Template.resolution.helpers({
    isOwner: function() {
      return this.owner === Meteor.userId();
    }
  });

  Template.resolution.events({
    // new event when checkbox is checked or unchecked
    'click .toggle-checked': function() {
      Meteor.call("updateResolution", this._id, !this.checked)
    },
    'click .delete': function() {
      // call method to remove resolution passing id of resolution as parameter
      Meteor.call("deleteResolution", this._id);
    },
    'click .toggle-private': function() {
      Meteor.call("setPrivate", this._id, !this.private)
    }
  });
}