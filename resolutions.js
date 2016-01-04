// Create a new collection on Mongo database
Resolutions = new Mongo.Collection('resolutions');



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


