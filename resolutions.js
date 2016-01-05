



if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup   //when removed it chrashes
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


