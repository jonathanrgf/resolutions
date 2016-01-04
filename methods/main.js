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