Template.padItem.events({
  'click .add-item': function(event, template){
    event.preventDefault();

    //TODO - need to take an attribute hash and send in all values
    var item = this;
    var pad = Pads.findOne(item.padId);
    var station = Stations.findOne(pad.stationId);

    if(item._id){
      item.productId = item._id;
      item.padName = pad.name;
      item.stationName = station.name;
      item.dockingStartsAt = new Date(Session.get('availabilityStarts'));
      item.dockingEndsAt = new Date(Session.get('availabilityEnds'));
      delete item._id;
    }
    if(!Meteor.userId()){
      item.deviceId = Session.get('Cart-deviceId');
    }else{
      item.userId = Meteor.userId();
    }

    Cart.Items.insert(item);
  },
  'click .color-one': function(event, template){
    event.preventDefault();

    var docking = this;
    var padId = template.data._id;

    Session.set(padId + '-selectedDockingTime', this._id);
  }
});

Template.padItem.helpers({
  dockings: function() {
    return Dockings.find({padId: this._id});
  },
  selectedDocking: function () {
    var padId = this._id;
    var dockingId = Session.get(padId + '-selectedDockingTime');
    var docking;
    if(dockingId) {
      docking = Dockings.findOne(dockingId);
    } else {
      docking = Dockings.find({padId: this._id}).fetch()[0];
    }
    return docking;
  }
});