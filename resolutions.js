// Create a new collection on Mongo database
Resolutions = new Mongo.Collection('resolutions');

if (Meteor.isClient) {
  // subscribe to resolutions collection
  Meteor.subscribe("resolutions");

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

  Accounts.ui.config({
    passwordSignupFields: "USERNAME_ONLY"
  })

}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });

  Meteor.publish("resolutions", function() {
    return Resolutions.find({
      // advance Mongo query
      $or: [
        { private: {$ne: true} },
        { owner: this.userId }
      ]
    });
  });
}

/* Methods that application will have access to in the client side 
and will be able to block things based on user id (weather user is logged in) */
Meteor.methods({

  // method to add new resolution
  addResolution: function(title) {
    Resolutions.insert({
      title : title,
      createdAt: new Date(),
      owner: Meteor.userId()
    });
  },

  // method to update checked list when checkbox is clicked
  updateResolution: function(id, checked) {
    var res = Resolutions.findOne(id);

    if (res.owner !== Meteor.userId()) {
      throw new Meteor.Error('not-authorized');
    }

    Resolutions.update(id, {$set:{checked: checked}})
  },

  // method to remove resolution
  deleteResolution: function(id) {
    var res = Resolutions.findOne(id);
    // if is not the owner of the resolution don't allow to remove it.
    if (res.owner !== Meteor.userId()) {
      throw new Meteor.Error('not-authorized');
    }

    Resolutions.remove(id);
  },

  // method for private button to make resoulion private
  setPrivate: function(id, private) {
    // find one resolution on mongoDB and set it to res
    var res = Resolutions.findOne(id);
    // if is not the current owner don't allow them
    if (res.owner !== Meteor.userId()) {
      throw new Meteor.Error('not-authorized');
    }

    Resolutions.update(id, {$set:{private: private}})

  }
});
