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

 

  Accounts.ui.config({
    passwordSignupFields: "USERNAME_ONLY"
  })