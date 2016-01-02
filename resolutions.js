// Create a new collection on Mongo database
Resolutions = new Mongo.Collection('resolutions');

if (Meteor.isClient) {
  Template.body.helpers({
    resolutions: function() {
      return Resolutions.find();
    }
  });

  Template.body.events({
    'submit .new-resolution': function(event) {
      var title = event.target.title.value;

      Resolutions.insert({
        title : title,
        createdAt: new Date()
      });

      //eliminating previews value from the field
      event.target.title.value = "";

      return false;
    }
  });

  Template.resolution.events({
    // new event when checkbox is checked or unchecked
    'click .toggle-checked': function() {
      Resolutions.update(this._id, {$set:{checked: !this.checked}})
    },
    'click .delete': function() {
      Resolutions.remove(this._id);
    }
  });

}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
