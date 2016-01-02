// Create a new collection on Mongo database
Resolutions = new Mongo.Collection('resolutions');

if (Meteor.isClient) {
  Template.body.helpers({
    resolutions: function() {
      if (Session.get('hideFinished')) {
        return Resolutions.find({checked: {$ne: true}});
      } else {
          return Resolutions.find();
      }
    },
    hideFinished: function() {
      return Session.get('hideFinished');
    }
  });

  Template.body.events({
    'submit .new-resolution': function(event) {
      var title = event.target.title.value;

      // call a method to add new resolution passing title as parameter
      Meteor.call("addResolution", title);

      //eliminating previews value from the field
      event.target.title.value = "";

      return false;
    },
    // new event for hide finished resolutions
    'change .hide-finished': function(event) {
      Session.set('hideFinished', event.target.checked);
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
    }
  });

  Accounts.ui.config({
    passwordSignupFields: "USERNAME_ONLY"
  })

}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}

/* Methods that application will have access to in the client side 
and will be able to block things based on user id (weather user is logged in) */
Meteor.methods({

  // method to add new resolution
  addResolution: function(title) {
    Resolutions.insert({
      title : title,
      createdAt: new Date()
    });
  },

  // method to update checked list when checkbox is clicked
  updateResolution: function(id, checked) {
    Resolutions.update(id, {$set:{checked: checked}})
  },

  // method to remove resolution
  deleteResolution: function(id) {
    Resolutions.remove(id);
  }
});
